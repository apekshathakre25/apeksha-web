const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema(
    {
        projectName: {
            type: String,
            required: true
        },
        
        name: [{
            type: String,
            required: true
        }],
        beRepo: [{
            type: String
        }],
        feRepo: [{
            type: String
        }],
        infraRepo: [{
            type: String
        }],
        plannerUrl: [{
            type: String
        }],
        groupChatroom: [{
            type: String
        }],
        awsAccount: [{
            type: String
        }],
        figmaLink: [{
            type: String
        }],
        projectTechStack: {
            type: String
        },
        thirdPartyIntegration: {
            type: String
        },
        remark: {
            type: String
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Project', ProjectSchema);
