const Project = require('../models/projectModel')
const createProject = async (req, res) => {
  try {
    const {
      projectName,
      name,
      beRepo,
      feRepo,
      infraRepo,
      plannerUrl,
      groupChatroom,
      awsAccount,
      figmaLink,
      projectTechStack,
      thirdPartyIntegration,
      remark,
    } = req.body;
    

    if (!projectName || typeof projectName !== 'string' || !projectName.trim()) {
      return res.status(400).json({ message: 'projectName is required and must be a non-empty string' });
    }

    if (!Array.isArray(name) || name.length === 0 || name.some(n => typeof n !== 'string' || !n.trim())) {
      return res.status(400).json({ message: 'name must be a non-empty array of non-empty strings' });
    }

    const validateArrayOfStrings = (field, fieldName) => {
      if (field && (!Array.isArray(field) || field.some(item => typeof item !== 'string'))) {
        return `${fieldName} must be an array of strings`;
      }
      return null;
    };

    const fieldErrors = [
      validateArrayOfStrings(beRepo, 'beRepo'),
      validateArrayOfStrings(feRepo, 'feRepo'),
      validateArrayOfStrings(infraRepo, 'infraRepo'),
      validateArrayOfStrings(plannerUrl, 'plannerUrl'),
      validateArrayOfStrings(groupChatroom, 'groupChatroom'),
      validateArrayOfStrings(awsAccount, 'awsAccount'),
      validateArrayOfStrings(figmaLink, 'figmaLink'),
    ].filter(Boolean);

    if (fieldErrors.length > 0) {
      return res.status(400).json({ message: fieldErrors.join(', ') });
    }

    const newProject = new Project({
      projectName,
      name,
      beRepo,
      feRepo,
      infraRepo,
      plannerUrl,
      groupChatroom,
      awsAccount,
      figmaLink,
      projectTechStack,
      thirdPartyIntegration,
      remark,
    });

    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getProjects = async (req, res) => {
  try {
    const { search = '', page = 1, limit = 10 } = req.query;

    const searchRegex = new RegExp(search, 'i'); // case-insensitive search

    const filter = {
      $or: [
        { projectName: searchRegex },
        { name: searchRegex },
        { projectTechStack: searchRegex },
        { thirdPartyIntegration: searchRegex },
      ],
    };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Project.countDocuments(filter);
    const projects = await Project.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      data: projects, 
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;    
    const {
      projectName,
      name,
      beRepo,
      feRepo,
      infraRepo,
      plannerUrl,
      groupChatroom,
      awsAccount,
      figmaLink,
      projectTechStack,
      thirdPartyIntegration,
      remark,
    } = req.body;

    if (!projectName || typeof projectName !== 'string' || !projectName.trim()) {
      return res.status(400).json({ message: 'projectName is required and must be a non-empty string' });
    }

    if (!Array.isArray(name) || name.length === 0 || name.some(n => typeof n !== 'string' || !n.trim())) {
      return res.status(400).json({ message: 'name must be a non-empty array of non-empty strings' });
    }

    const validateArrayOfStrings = (field, fieldName) => {
      if (field && (!Array.isArray(field) || field.some(item => typeof item !== 'string'))) {
        return `${fieldName} must be an array of strings`;
      }
      return null;
    };

    const fieldErrors = [
      validateArrayOfStrings(beRepo, 'beRepo'),
      validateArrayOfStrings(feRepo, 'feRepo'),
      validateArrayOfStrings(infraRepo, 'infraRepo'),
      validateArrayOfStrings(plannerUrl, 'plannerUrl'),
      validateArrayOfStrings(groupChatroom, 'groupChatroom'),
      validateArrayOfStrings(awsAccount, 'awsAccount'),
      validateArrayOfStrings(figmaLink, 'figmaLink'),
    ].filter(Boolean);

    if (fieldErrors.length > 0) {
      return res.status(400).json({ message: fieldErrors.join(', ') });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      {
        projectName,
        name,
        beRepo,
        feRepo,
        infraRepo,
        plannerUrl,
        groupChatroom,
        awsAccount,
        figmaLink,
        projectTechStack,
        thirdPartyIntegration,
        remark,
      },
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};


module.exports = { createProject, getProjects, updateProject };
