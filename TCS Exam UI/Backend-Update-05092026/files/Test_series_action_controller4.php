<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/* set timezone default */
date_default_timezone_set("Asia/Calcutta");

class Test_series_action_controller extends CI_Controller {

    public function __construct()
    {
        parent::__construct();
        $this->load->model('Test_Series_Action_Model');
    }

    public function candidate_confirmation($exm_tkn){
        $data = array(
            'cand_confirm' => $this->input->post('cand_confirm'),
        );
        $update = $this->Test_Series_Action_Model->update_candidate_data_after_launch_test($exm_tkn, $data);

        if ($update != false) {
            redirect(base_url('ReadInstructions/' . $exm_tkn));
        } else {
            $this->session->set_flashdata('error', 'The token is invalid. You have already used this token, and it cannot be reused. You may relaunch this test, or please contact the admin to remap your exam token.');
            redirect(base_url('confirmation/' . $exm_tkn));
        }
    }

    public function disclaimer($exm_tkn){
        $data = array(
            'deLang'     => $this->input->post('defaultLanguage'),
            'disclaimer' => $this->input->post('disclaimer'),
        );
        $update = $this->Test_Series_Action_Model->update_candidate_data_after_launch_test($exm_tkn, $data);

        if ($update != false) {
            $this->session->set_flashdata('success', 'Assessment Window Opened');
            redirect(base_url('AssessmentWindow/' . $exm_tkn));
        } else {
            $this->session->set_flashdata('error', 'The token is invalid. You have already used this token, and it cannot be reused. You may relaunch this test, or please contact the admin to remap your exam token.');
            redirect(base_url('ReadOtherInstructions/' . $exm_tkn));
        }
    }

    // ------------------------------------------------------------------
    // REAL-TIME AUTOSAVE (called repeatedly during the exam by the JS)
    // ------------------------------------------------------------------

    /**
     * Accepts a JSON body: { responses: [...], remaining_seconds: 1234 }
     * Upserts each response keyed on (exam_token_key, ques_id) — safe to
     * call repeatedly for the same question without creating duplicates,
     * as long as the unique key migration has been run.
     *
     * ques_status is never trusted as-is from the client — it is always
     * re-derived from whether choosen_option is actually set, so a stale
     * or out-of-sync client status can never corrupt scoring.
     */
    public function save_batch_responses($exm_tkn){
        $raw   = $this->input->raw_input_stream;
        $input = json_decode($raw, true);

        if (!isset($input['responses']) || !is_array($input['responses'])) {
            echo json_encode(['status' => 'fail', 'message' => 'Malformed request']);
            return;
        }

        $rows = [];
        foreach ($input['responses'] as $r) {
            if (empty($r['ques_id'])) {
                continue; // skip malformed entries rather than failing the whole batch
            }

            $chosen        = isset($r['choosen_option']) ? $r['choosen_option'] : '0';
            $client_status = isset($r['ques_status']) ? $r['ques_status'] : 0;

            $rows[] = [
                'exam_token_key' => $exm_tkn,
                'exam_id'        => isset($r['exam_id']) ? $r['exam_id'] : 0,
                'candidate_id'   => isset($r['candidate_id']) ? $r['candidate_id'] : '',
                'sec_id'         => isset($r['sec_id']) ? $r['sec_id'] : 0,
                'set_id'         => isset($r['set_id']) ? $r['set_id'] : 0,
                'ques_id'        => $r['ques_id'],
                'ques_status'    => $this->Test_Series_Action_Model->derive_status($chosen, $client_status),
                'choosen_option' => ($chosen === null || $chosen === '') ? '0' : $chosen,
                'datetime'       => date('Y-m-d H:i:s'),
            ];
        }

        $result = empty($rows) ? true : $this->Test_Series_Action_Model->save_batch_responses($rows);

        if (isset($input['remaining_seconds']) && is_numeric($input['remaining_seconds'])) {
            $this->Test_Series_Action_Model->update_remaining_time($exm_tkn, (int) $input['remaining_seconds']);
        }

        echo json_encode(['status' => $result ? 'ok' : 'fail', 'saved' => count($rows)]);
    }

    /**
     * Called on page load so the JS can repopulate already-saved answers
     * and resume the countdown timer after a refresh/crash instead of
     * starting the candidate over.
     */
    public function get_saved_responses($exm_tkn){
        $responses = $this->Test_Series_Action_Model->get_saved_responses($exm_tkn);
        $remaining = $this->Test_Series_Action_Model->get_remaining_time($exm_tkn);

        echo json_encode([
            'responses'         => $responses,
            'remaining_seconds' => $remaining, // null if exam hasn't started yet
        ]);
    }

    // ------------------------------------------------------------------
    // FINAL SUBMIT
    // ------------------------------------------------------------------

    /**
     * Now a safety-net upsert rather than a fresh insert. If autosave
     * already saved everything, this just overwrites with final state
     * (harmless). If autosave was interrupted for some questions, this
     * still saves them at submit time. Either way ques_status is derived
     * server-side, so the "answered but status=1" bug can't recur.
     */
    public function insert_assessment_data($exm_tkn){
        $resArray = $this->input->post();

        if (empty($resArray['ques_id']) || !is_array($resArray['ques_id'])) {
            $this->session->set_flashdata('error', 'No responses were submitted.');
            redirect(base_url('assessment-summary/' . $exm_tkn));
            return;
        }

        $ques_count = count($resArray['ques_id']);
        $choosen_option = [];

        for ($i = 1; $i <= $ques_count; $i++) {
            $key = "choosen_option_$i";
            $choosen_option[$key] = (isset($resArray[$key]) && $resArray[$key] !== '') ? $resArray[$key] : 0;
        }

        for ($i = 1; $i <= $ques_count; $i++) {
            unset($resArray["choosen_option_$i"]);
        }

        $result = false;

        for ($i = 0; $i < $ques_count; $i++) {
            $chosen        = $choosen_option["choosen_option_" . ($i + 1)];
            $client_status = isset($resArray['ques_status'][$i]) ? $resArray['ques_status'][$i] : 0;

            $data = [
                'exam_token_key' => $resArray['exam_token_key'][$i],
                'exam_id'        => $resArray['exam_id'][$i],
                'candidate_id'   => $resArray['candidate_id'][$i],
                'sec_id'         => $resArray['sec_id'][$i],
                'set_id'         => $resArray['set_id'][$i],
                'ques_id'        => $resArray['ques_id'][$i],
                'ques_status'    => $this->Test_Series_Action_Model->derive_status($chosen, $client_status),
                'choosen_option' => $chosen,
                'datetime'       => date("Y-m-d H:i:s"),
            ];

            $result = $this->Test_Series_Action_Model->insert_assessment_data($data);

            if ($result === false) {
                $this->session->set_flashdata('error', 'An error has occurred while saving your response');
                redirect(base_url('assessment-summary/' . $exm_tkn));
                return;
            }
        }

        $data = [
            'is_submitted'     => 1,
            'security_msg'     => $this->input->post('security_msg'),
            'submit_date_time' => date('Y-m-d H:i:s'),
        ];
        $update = $this->Test_Series_Action_Model->update_candidate_data_after_launch_test($exm_tkn, $data);

        if ($update != false) {
            $this->session->set_flashdata('success', 'Your response has been saved successfully');
        } else {
            $this->session->set_flashdata('error', 'Your response has been saved successfully but failed to update your data.');
        }

        // Score the exam right now, at the moment of submission — do not
        // wait for the candidate to click through summary -> feedback ->
        // score page. If they close the tab or never return, the score
        // still exists.
        //
        // NOTE: verify 'test_name' matches your actual `test_series_tbl`
        // column for the exam's display name — adjust if different.
        $candidate = $this->Test_Series_Action_Model->fetch_candidate_details($resArray['candidate_id'][0]);
        $examInfo  = $this->Test_Series_Action_Model->fetch_exam_details($resArray['exam_id'][0]);

        $candName = '';
        if (!empty($candidate[0])) {
            $fname = isset($candidate[0]['Fname']) ? trim($candidate[0]['Fname']) : '';
            $lname = isset($candidate[0]['Lname']) ? trim($candidate[0]['Lname']) : '';
            $candName = trim($fname . ' ' . $lname);
        }
        $examName = isset($examInfo[0]['test_name']) ? $examInfo[0]['test_name'] : '';

        $this->Test_Series_Action_Model->calculate_and_save_score(
            $exm_tkn,
            $resArray['exam_id'][0],
            $resArray['candidate_id'][0],
            $candName,
            $examName
        );

        redirect(base_url('assessment-summary/' . $exm_tkn));
    }

    public function assessment_feedback_submit($exm_tkn){
        $data = array(
            'cand_id'          => $this->input->post('cand_id'),
            'cand_name'        => $this->input->post('cand_name'),
            'exam_id'          => $this->input->post('exam_id'),
            'exam_name'        => $this->input->post('exam_name'),
            'exam_token_key'   => $exm_tkn,
            'testRating'       => $this->input->post('testRating'),
            'feedbackComments' => $this->input->post('feedbackComments'),
            'datetime'         => date('Y-m-d H:i:s'),
        );
        $result = $this->Test_Series_Action_Model->insert_assessment_feedback($data);

        if ($result != false) {
            // score_uploaded used to be set by the score page's "Finish Exam"
            // button. That page is gone now, so we set it here instead —
            // the actual score was already computed and saved back at
            // submit time (calculate_and_save_score), this flag now just
            // means "feedback done, cleared to view analysis."
            $data = [
                'submitted_feedback'    => 1,
                'submitted_feedback_on' => date('Y-m-d H:i:s'),
                'score_uploaded'        => 1,
            ];
            $update = $this->Test_Series_Action_Model->update_candidate_data_after_launch_test($exm_tkn, $data);

            if ($update != false) {
                $this->session->set_flashdata('success', 'Thanks for your feedback!');
            } else {
                $this->session->set_flashdata('error', 'Your feedback has been saved successfully but failed to update your data.');
            }
            redirect(base_url('assessment-analysis/' . $exm_tkn));
        } else {
            $this->session->set_flashdata('error', 'Failed to save your feedback!');
            redirect(base_url('assessment-summary/' . $exm_tkn));
        }
    }

}
