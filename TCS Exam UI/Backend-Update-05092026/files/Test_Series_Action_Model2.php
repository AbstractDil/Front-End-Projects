<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Test_Series_Action_Model extends CI_Model {

    public function insert_candidate_data($data){
        $this->db->insert('test_series_candidates_tbl', $data);
        return $this->db->affected_rows() > 0;
    }

    /**
     * Single-source-of-truth status logic. Never trusts the client's
     * ques_status flag on its own — only uses it to know whether "marked
     * for review" was set. Status is always derived from whether an
     * actual option was chosen, so a stale/out-of-order client update
     * can never disagree with what was actually answered.
     *
     * Status codes (matches the candidate JS):
     *   0 = not visited, 1 = visited/not answered,
     *   2 = answered, 3 = marked (not answered), 4 = marked + answered
     */
    public function derive_status($chosen_option, $client_status){
        $has_answer = !($chosen_option === 0 || $chosen_option === '0' || $chosen_option === '' || $chosen_option === null);

        if ($has_answer) {
            return ($client_status == 3 || $client_status == 4) ? 4 : 2;
        }

        return ($client_status == 3 || $client_status == 0) ? (int) $client_status : 1;
    }

    // Final-submit path — upsert so it's safe to run even if autosave
    // already saved these answers (won't create duplicate rows).
    public function insert_assessment_data($data){
        $result = $this->db->replace('candidate_response_tbl', $data);
        return $result ? true : false;
    }

    // Real-time autosave path — one upsert per response in the batch.
    // Requires the unique key on (exam_token_key, ques_id) from migration.sql.
    public function save_batch_responses($responses){
        $success = true;
        foreach ($responses as $data) {
            $ok = $this->db->replace('candidate_response_tbl', $data);
            if (!$ok) {
                $success = false;
            }
        }
        return $success;
    }

    // Used on page load to repopulate a candidate's already-saved answers
    // after a refresh or crash.
    public function get_saved_responses($token_key){
        $this->db->select('ques_id, sec_id, set_id, ques_status, choosen_option');
        $this->db->where('exam_token_key', $token_key);
        $query = $this->db->get('candidate_response_tbl');
        return $query->result_array();
    }

    public function update_remaining_time($token_key, $seconds){
        $this->db->where('exam_token_key', $token_key);
        $this->db->update('test_series_candidates_tbl', ['remaining_seconds' => $seconds]);
        return true; // an unchanged value legitimately affects 0 rows — don't treat that as failure
    }

    public function get_remaining_time($token_key){
        $this->db->select('remaining_seconds');
        $this->db->where('exam_token_key', $token_key);
        $row = $this->db->get('test_series_candidates_tbl')->row_array();
        return $row ? $row['remaining_seconds'] : null;
    }

    public function insert_assessment_feedback($data){
        $this->db->insert('ts_feedback_tbl', $data);
        return $this->db->affected_rows() > 0;
    }

    public function insert_assessment_score($data){
        $this->db->insert('cand_score_tbl', $data);
        return $this->db->affected_rows() > 0;
    }

    /*********** All Fetch Queries Go Here ***********/

    public function check_exam_token($token_key){
        $query = $this->db->get_where('test_series_candidates_tbl', array('exam_token_key' => $token_key));
        return $query->row_array();
    }

    public function fetch_details_by_token($token_key){
        $this->db->select('*');
        $this->db->where('exam_token_key', $token_key);
        $query = $this->db->get('test_series_candidates_tbl');
        return $query->result_array();
    }

    public function fetch_candidate_details($candidateId){
        $this->db->select('*');
        $this->db->where('Student_Id', $candidateId);
        $query = $this->db->get('student');
        return $query->result_array();
    }

    public function fetch_exam_details($exam_id){
        $this->db->select('*');
        $this->db->where('test_id', $exam_id);
        $query = $this->db->get('test_series_tbl');
        return $query->result_array();
    }

    public function fetch_res_to_calcaute_score($token_key){
        $this->db->select('cr.sec_id, cr.set_id, cr.ques_id, qb.correct_option, cr.choosen_option, cr.ques_status');
        $this->db->from('candidate_response_tbl cr');
        $this->db->join('questions_bank_tbl qb', 'cr.ques_id = qb.qid');
        $this->db->where('cr.exam_token_key', $token_key);
        $this->db->where_in('cr.ques_status', [2, 4]);
        $query = $this->db->get();
        return $query->result();
    }

    public function fetchAllSections($data, $tableName, $where){
        $query = $this->db->select($data)
                           ->from($tableName)
                           ->where($where)
                           ->order_by('datetime', 'DESC')
                           ->get();
        return $query->result_array();
    }

    public function fetchAllQuestions($data, $tableName, $where){
        $query = $this->db->select($data)
                           ->from($tableName)
                           ->where($where)
                           ->order_by('datetime', 'DESC')
                           ->get();
        return $query->result_array();
    }

    public function get_questions_by_set_ids($set_ids){
        $this->db->where_in('qset_id', $set_ids);
        $query = $this->db->get('questions_bank_tbl');
        return $query->result_array();
    }

    public function get_responses_by_token_and_question_ids($token_key, $question_ids){
        $this->db->where('exam_token_key', $token_key);
        $this->db->where_in('ques_id', $question_ids);
        $query = $this->db->get('candidate_response_tbl');
        return $query->result_array();
    }

    /*********** Scoring (runs automatically at final submit) ***********/

    // Moved here from TS_Exam_controller (where they were private) so the
    // submit-time scoring call below can share the exact same logic the
    // score page has always used for its per-section display.
    public function get_section_name($sec_id){
        $where = array('qsec_id' => $sec_id);
        $section_data = $this->fetchAllSections('sec_name', 'ts_section_tbl', $where);
        return isset($section_data[0]['sec_name']) ? $section_data[0]['sec_name'] : 'Unknown Section';
    }

    public function get_total_questions($sec_id, $set_id){
        $where = array('qsec_id' => $sec_id, 'qset_id' => $set_id);
        $total_questions = $this->fetchAllQuestions('*', 'questions_bank_tbl', $where);
        return count($total_questions);
    }

    // Guards against ever inserting two score rows for the same attempt —
    // makes calculate_and_save_score() safe to call more than once.
    public function score_exists($token_key){
        $this->db->where('exam_token_key', $token_key);
        $query = $this->db->get('cand_score_tbl');
        return $query->num_rows() > 0;
    }

    public function get_saved_score($token_key){
        $this->db->where('exam_token_key', $token_key);
        $query = $this->db->get('cand_score_tbl');
        return $query->row_array();
    }

    /**
     * Computes total correct/incorrect/marks/percentage from
     * candidate_response_tbl + the exam's per-section mark weights, and
     * inserts one row into cand_score_tbl — idempotent via score_exists().
     *
     * Called automatically right after final submit, so scoring no longer
     * depends on the candidate completing summary -> feedback -> score
     * page -> "Finish Exam" click. That manual flow still runs afterward
     * (see save_assessment_score() in the controller) but now just
     * confirms progress rather than performing the save itself.
     */
    public function calculate_and_save_score($token_key, $exam_id, $candidate_id, $cand_name = '', $exam_name = ''){
        if ($this->score_exists($token_key)) {
            return true; // already scored — nothing to do
        }

        $response_details = $this->fetch_res_to_calcaute_score($token_key);

        $section_scores = [];
        foreach ($response_details as $row) {
            $sec_id = $row->sec_id;
            $set_id = $row->set_id;

            if (!isset($section_scores[$sec_id])) {
                $section_scores[$sec_id] = [
                    'correct'          => 0,
                    'incorrect'        => 0,
                    'total_questions'  => $this->get_total_questions($sec_id, $set_id)
                ];
            }

            if ($row->choosen_option == $row->correct_option) {
                $section_scores[$sec_id]['correct']++;
            } else {
                $section_scores[$sec_id]['incorrect']++;
            }
        }

        $exam_rows = $this->fetch_exam_details($exam_id);
        if (empty($exam_rows)) {
            return false; // no exam config found — can't score
        }
        $exam = $exam_rows[0];

        $total_correct        = 0;
        $total_incorrect      = 0;
        $total_marks_obtained = 0;
        $total_marks          = 0;

        for ($i = 1; $i <= 5; $i++) {
            $sec_id      = isset($exam['section_' . $i]) ? $exam['section_' . $i] : 0;
            $marks_right = isset($exam['marks_for_right_ans_sec_' . $i]) ? $exam['marks_for_right_ans_sec_' . $i] : 0;
            $marks_wrong = isset($exam['marks_for_wrong_ans_sec_' . $i]) ? $exam['marks_for_wrong_ans_sec_' . $i] : 0;

            if ($sec_id == 0 || $marks_right == 0 || !isset($section_scores[$sec_id])) {
                continue;
            }

            $scores          = $section_scores[$sec_id];
            $correct         = $scores['correct'];
            $incorrect       = $scores['incorrect'];
            $total_questions = $scores['total_questions'];

            $marks_obtained     = ($correct * $marks_right) - ($incorrect * $marks_wrong);
            $section_total_marks = $total_questions * $marks_right;

            $total_correct        += $correct;
            $total_incorrect      += $incorrect;
            $total_marks_obtained += $marks_obtained;
            $total_marks          += $section_total_marks;
        }

        $percentage = ($total_marks > 0) ? ($total_marks_obtained / $total_marks) * 100 : 0;

        $data = [
            'cand_id'            => $candidate_id,
            'cand_name'          => $cand_name,
            'exam_id'            => $exam_id,
            'exam_name'          => $exam_name,
            'exam_token_key'     => $token_key,
            'total_correct'      => $total_correct,
            'total_incorrect'    => $total_incorrect,
            'total_marks_obtain' => $total_marks_obtained,
            'total_marks'        => $total_marks,
            'percentage'         => number_format($percentage, 2),
            'datetime'           => date('Y-m-d H:i:s'),
        ];

        return $this->insert_assessment_score($data);
    }

    /*********** All Update Queries Go Here ***********/

    public function update_candidate_data_after_launch_test($exm_tkn, $data){
        $this->db->where('exam_token_key', $exm_tkn);
        $this->db->update('test_series_candidates_tbl', $data);
        return $this->db->affected_rows() > 0;
    }

    /*********** All Delete Queries Go Here ***********/

}
