const express = require('express');
const { createProject, getProjects, updateProject } = require('../controllers/projectController');
const router = express.Router();

router.get('/get-project', getProjects);
router.post('/create-project', createProject);

router.put('/update-project/:id', updateProject); 

module.exports = router;
