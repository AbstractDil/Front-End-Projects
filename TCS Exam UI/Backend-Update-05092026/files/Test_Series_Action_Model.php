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

    /*********** All Update Queries Go Here ***********/

    public function update_candidate_data_after_launch_test($exm_tkn, $data){
        $this->db->where('exam_token_key', $exm_tkn);
        $this->db->update('test_series_candidates_tbl', $data);
        return $this->db->affected_rows() > 0;
    }

    /*********** All Delete Queries Go Here ***********/

}
