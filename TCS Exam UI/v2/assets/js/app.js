// alpine js for fetching user data and examination data from json file and displaying it in the header

document.addEventListener('alpine:init', () => {
    Alpine.data('assessmentConfigDetails', () => ({
        // candidate details
        candidate_id: '',
        candidate_name: '',
        candidate_photo: '',
        candidate_photo_path: '',
        candidate_live_photo: '',
        candidate_live_photo_path: '',
        password: '',

        // examination details
        examination_id: '',
        examination_name: '',
        examination_date: '',
        examination_start_time: '',
        examination_end_time: '',
        subjects: '',

        init() {
            // Fetch candidate data from JSON file
            axios.get('db/candidate.json')
                .then(response => {
                    const data = response.data;
                    console.log('Candidate Data:', data); // Log the fetched data for debugging
                    this.candidate_id = data.candidate_id;
                    this.candidate_name = data.candidate_name;
                    this.candidate_photo = data.candidate_photo;
                    this.candidate_photo_path = data.candidate_photo_path + data.candidate_photo;
                    this.candidate_live_photo = data.candidate_live_photo;
                    this.candidate_live_photo_path = data.candidate_live_photo_path + data.candidate_live_photo; 
                    this.password = data.password;
                })
                .catch(error => {
                    console.error('Error fetching user data:', error);
                });

                 // Fetch examination data from JSON file
            axios.get('db/examination.json')
                .then(response => {
                    const data = response.data;
                    console.log('Examination Data:', data); // Log the fetched data for debugging
                    this.examination_id = data.examination_id;
                    this.examination_name = data.examination_name;
                    this.examination_date = data.examination_date;
                    this.examination_start_time = data.examination_start_time;
                    this.examination_end_time = data.examination_end_time;
                    this.subjects = data.subjects;
                })
                .catch(error => {
                    console.error('Error fetching examination data:', error);
                });
        }
    
    }));
});


   
