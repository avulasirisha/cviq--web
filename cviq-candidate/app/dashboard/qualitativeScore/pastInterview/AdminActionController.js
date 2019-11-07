var Service = require('../../Services');
var UniversalFunctions = require('../../Utils/UniversalFunctions');
var async = require('async');
var log4js = require('log4js');
var logger = log4js.getLogger('[Admin_Action]');
var interviewController = require('../Candidate/CandidateInterviewController');
var NotificationManager = require('../../Lib/NotificationManager');


/*
 ----------------------------------------
 VERIFY INTERVIEWER PROFILE
 ----------------------------------------
 */
var verifyInterviewerProfile = function (accessToken, payload, callbackRoute) {

    async.waterfall([
        function (callback) {
            var criteria = {accessToken: accessToken};
            var projection = {};
            var options = {limit: 1};
            Service.AdminService.getAdmin(criteria, projection, options, function(err, data) {
                if(err) {
                    callback(err);
                } else if (data && data.length > 0 && data[0]._id) {
                    callback(null, data[0]);
                } else {
                    callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_ACCESS_TOKEN);
                }
            });
        },
        function (adminData, callback) {
            var criteria = {_id: payload.interviewerID};
            var projection = {_id: 1};
            var options = {limit: 1};
            Service.InterviewerService.getInterviewer(criteria, projection, options, function(err, data) {
                if(err) {
                    callback(err);
                } else if (data && data.length > 0 && data[0]._id) {
                    callback(null, data[0]);
                } else {
                    callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INTERVIEWER_NOT_FOUND);
                }
            });
        },
        function (interviewerData, callback) {
            var criteria = {_id: payload.interviewerID};
            var setQuery = {
                $set: {
                    profileReviewedByAdmin: true,
                    isVerified: true
                }
            };
            var options = {lean: true};
            Service.InterviewerService.updateInterviewer(criteria, setQuery, options, callback);
        }
    ], function (error, success) {
        if (error) {
            callbackRoute(error);
        } else {
            callbackRoute(null, {});
        }
    })
};

/*
 ----------------------------------------
 BLOCK/UNBLOCK INTERVIEWER
 ----------------------------------------
 */
var blockUnblockInterviewer = function (accessToken, payload, callbackRoute) {

    async.waterfall([
        function (callback) {
            var criteria = {accessToken: accessToken};
            var projection = {};
            var options = {limit: 1};
            Service.AdminService.getAdmin(criteria, projection, options, function(err, data) {
                if(err) {
                    callback(err);
                } else if (data && data.length > 0 && data[0]._id) {
                    callback(null, data[0]);
                } else {
                    callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_ACCESS_TOKEN);
                }
            });
        },
        function (adminData, callback) {
            var criteria = {_id: payload.interviewerID};
            var projection = {_id: 1, isBlocked: 1};
            var options = {limit: 1};
            Service.InterviewerService.getInterviewer(criteria, projection, options, function(err, data) {
                if(err) {
                    callback(err);
                } else if (data && data.length > 0 && data[0]._id) {
                    if(data[0].isBlocked == payload.isBlocked && payload.isBlocked) {
                        callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.ALREADY_BLOCKED);
                    } else if(data[0].isBlocked == payload.isBlocked && !payload.isBlocked) {
                        callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.ALREADY_UNBLOCKED);
                    } else {
                        callback(null, data[0]);
                    }
                } else {
                    callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INTERVIEWER_NOT_FOUND);
                }
            });
        },
        function (interviewerData, callback) {
            var criteria = {_id: payload.interviewerID};
            var setQuery = {
                $set: {
                    isBlocked: payload.isBlocked
                }
            };
            var options = {lean: true};
            Service.InterviewerService.updateInterviewer(criteria, setQuery, options, callback);
        }
    ], function (error, success) {
        if (error) {
            callbackRoute(error);
        } else {
            callbackRoute(null, {});
        }
    })
};

/*
 ----------------------------------------
 ADD MEMBERSHIP PLAN FOR RECRUITER
 ----------------------------------------
 */
var addMembershipPlan = function (accessToken, payload, callbackRoute) {

    var dataToSave = payload;
    async.waterfall([
        function (callback) {
            var criteria = {accessToken: accessToken};
            var projection = {};
            var options = {limit: 1};
            Service.AdminService.getAdmin(criteria, projection, options, function(err, data) {
                if(err) {
                    callback(err);
                } else if (data && data.length > 0 && data[0]._id) {
                    callback(null, data[0]);
                } else {
                    callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_ACCESS_TOKEN);
                }
            });
        },
        function (adminData, callback) {
            //Check plan already exist
            var criteria = {planType: payload.planType, isDeleted: false};
            var projection = {_id: 1};
            var options = {limit: 1};
            Service.MembershipPlanService.getMembershipPlan(criteria, projection, options, function(err, data) {
                if(err) {
                    callback(err);
                } else if (data && data.length > 0 && data[0]._id) {
                    if(payload.planType == UniversalFunctions.CONFIG.APP_CONSTANTS.DATABASE.MEMBERSHIP_PLAN_TYPE.BASIC) {
                        callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.BASIC_PLAN_ALREADY_EXIST);

                    } else if(payload.planType == UniversalFunctions.CONFIG.APP_CONSTANTS.DATABASE.MEMBERSHIP_PLAN_TYPE.REGULAR) {
                        callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.REGULAR_PLAN_ALREADY_EXIST);

                    } else if(payload.planType == UniversalFunctions.CONFIG.APP_CONSTANTS.DATABASE.MEMBERSHIP_PLAN_TYPE.PREMIUM) {
                        callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.PREMIUM_PLAN_ALREADY_EXIST);

                    } else {
                        callback(null);
                    }
                } else {
                    callback(null);
                }
            });
        },
        function (callback) {
            //Insert Into DB
            Service.MembershipPlanService.insertMembershipPlan(dataToSave, function (err, dataFromDB) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, dataFromDB);
                }
            })
        }
    ], function (error, success) {
        if (error) {
            callbackRoute(error);
        } else {
            callbackRoute(null, success);
        }
    })
};

/*
 ----------------------------------------
 UPDATE MEMBERSHIP PLAN FOR RECRUITER
 ----------------------------------------
 */
var updateRecruiterMembershipPlan = function (accessToken, payload, callbackRoute) {

    var dataToUpdate = payload;
    async.waterfall([
        function (callback) {
            var criteria = {accessToken: accessToken};
            var projection = {};
            var options = {limit: 1};
            Service.AdminService.getAdmin(criteria, projection, options, function(err, data) {
                if(err) {
                    callback(err);
                } else if (data && data.length > 0 && data[0]._id) {
                    callback(null, data[0]);
                } else {
                    callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_ACCESS_TOKEN);
                }
            });
        },
        function (adminData, callback) {
            //Check plan exist or not
            var criteria = {_id: payload.planID, isDeleted: false};
            var projection = {};
            var options = {limit: 1};
            Service.MembershipPlanService.getMembershipPlan(criteria, projection, options, function(err, data) {
                if(err) {
                    callback(err);
                } else if (data && data.length > 0 && data[0]._id) {
                    callback(null);
                } else {
                    callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.MEMBERSHIP_PLAN_NOT_FOUND);
                }
            });
        },
        function (callback) {
            //Check plan already exist
            var criteria = {
                _id: {$ne: payload.planID},
                isDeleted: false,
                planType: payload.planType
            };
            var projection = {};
            var options = {limit: 1};
            Service.MembershipPlanService.getMembershipPlan(criteria, projection, options, function(err, data) {
                if(err) {
                    callback(err);
                } else if (data && data.length > 0 && data[0]._id) {
                    if(payload.planType == UniversalFunctions.CONFIG.APP_CONSTANTS.DATABASE.MEMBERSHIP_PLAN_TYPE.BASIC) {
                        callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.BASIC_PLAN_ALREADY_EXIST);

                    } else if(payload.planType == UniversalFunctions.CONFIG.APP_CONSTANTS.DATABASE.MEMBERSHIP_PLAN_TYPE.REGULAR) {
                        callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.REGULAR_PLAN_ALREADY_EXIST);

                    } else if(payload.planType == UniversalFunctions.CONFIG.APP_CONSTANTS.DATABASE.MEMBERSHIP_PLAN_TYPE.PREMIUM) {
                        callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.PREMIUM_PLAN_ALREADY_EXIST);

                    } else {
                        callback(null);
                    }
                } else {
                    callback(null);
                }
            });
        },
        function (callback) {
            //Update Plan
            dataToUpdate.updatedAt = new Date().toISOString();

            var criteria = {_id: payload.planID};
            var setQuery = {
                $set: dataToUpdate
            };
            var options = {lean: true};
            Service.MembershipPlanService.updateMembershipPlan(criteria, setQuery, options, callback);
        }
    ], function (error, success) {
        if (error) {
            callbackRoute(error);
        } else {
            callbackRoute(null, success);
        }
    })
};

/*
 ----------------------------------------
 GET MEMBERSHIP PLAN FOR RECRUITER
 ----------------------------------------
 */
var getRecruiterMembershipPlan = function (accessToken, callbackRoute) {

    async.waterfall([
        function (callback) {
            var criteria = {accessToken: accessToken};
            var projection = {};
            var options = {limit: 1};
            Service.AdminService.getAdmin(criteria, projection, options, function(err, data) {
                if(err) {
                    callback(err);
                } else if (data && data.length > 0 && data[0]._id) {
                    callback(null, data[0]);
                } else {
                    callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_ACCESS_TOKEN);
                }
            });
        },
        function (adminData, callback) {
            //Check plan exist or not
            var criteria = {};
            var projection = {};
            var options = {};
            Service.MembershipPlanService.getMembershipPlan(criteria, projection, options, function(err, data) {
                if(err) {
                    callback(err);
                } else if (data && data.length > 0) {
                    callback(null, data);
                } else {
                    callback(null, []);
                }
            });
        }
    ], function (error, success) {
        if (error) {
            callbackRoute(error);
        } else {
            callbackRoute(null, success);
        }
    })
};

/*
 ----------------------------------------
 DELETE MEMBERSHIP PLAN FOR RECRUITER
 ----------------------------------------
 */
var deleteRecruiterMembershipPlan = function (accessToken, params, callbackRoute) {

    async.waterfall([
        function (callback) {
            var criteria = {accessToken: accessToken};
            var projection = {};
            var options = {limit: 1};
            Service.AdminService.getAdmin(criteria, projection, options, function(err, data) {
                if(err) {
                    callback(err);
                } else if (data && data.length > 0 && data[0]._id) {
                    callback(null, data[0]);
                } else {
                    callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_ACCESS_TOKEN);
                }
            });
        },
        function (adminData, callback) {
            //Check plan exist or not
            var criteria = {_id: params.planID, isDeleted: false};
            var projection = {};
            var options = {limit: 1};
            Service.MembershipPlanService.getMembershipPlan(criteria, projection, options, function(err, data) {
                if(err) {
                    callback(err);
                } else if (data && data.length > 0 && data[0]._id) {
                    callback(null);
                } else {
                    callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.MEMBERSHIP_PLAN_NOT_FOUND);
                }
            });
        },
        function (callback) {
            //Update Plan
            var dataToUpdate = {
                isDeleted: true,
                updatedAt : new Date().toISOString()
            };

            var criteria = {_id: params.planID};
            var setQuery = {
                $set: dataToUpdate
            };
            var options = {lean: true};
            Service.MembershipPlanService.updateMembershipPlan(criteria, setQuery, options, callback);
        }
    ], function (error, success) {
        if (error) {
            callbackRoute(error);
        } else {
            callbackRoute(null, success);
        }
    })
};

/*
 ----------------------------------------
 BLOCK/UNBLOCK CANDIDATE
 ----------------------------------------
 */
var blockUnblockCandidate = function (accessToken, payload, callbackRoute) {

    async.waterfall([
        function (callback) {
            var criteria = {accessToken: accessToken};
            var projection = {};
            var options = {limit: 1};
            Service.AdminService.getAdmin(criteria, projection, options, function(err, data) {
                if(err) {
                    callback(err);
                } else if (data && data.length > 0 && data[0]._id) {
                    callback(null, data[0]);
                } else {
                    callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_ACCESS_TOKEN);
                }
            });
        },
        function (adminData, callback) {
            var criteria = {_id: payload.candidateID};
            var projection = {_id: 1, isBlocked: 1};
            var options = {limit: 1};
            Service.CandidateService.getCandidate(criteria, projection, options, function(err, data) {
                if(err) {
                    callback(err);
                } else if (data && data.length > 0 && data[0]._id) {
                    if(data[0].isBlocked == payload.isBlocked && payload.isBlocked) {
                        callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.ALREADY_BLOCKED);
                    } else if(data[0].isBlocked == payload.isBlocked && !payload.isBlocked) {
                        callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.ALREADY_UNBLOCKED);
                    } else {
                        callback(null, data[0]);
                    }
                } else {
                    callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.CANDIDATE_NOT_FOUND);
                }
            });
        },
        function (interviewerData, callback) {
            var criteria = {_id: payload.candidateID};
            var setQuery = {
                $set: {
                    isBlocked: payload.isBlocked
                }
            };
            var options = {lean: true};
            Service.CandidateService.updateCandidate(criteria, setQuery, options, callback);
        }
    ], function (error, success) {
        if (error) {
            callbackRoute(error);
        } else {
            callbackRoute(null, {});
        }
    })
};

/*
 ----------------------------------------
 BLOCK/UNBLOCK RECRUITER
 ----------------------------------------
 */
var blockUnblockRecruiter = function (accessToken, payload, callbackRoute) {

    async.waterfall([
        function (callback) {
            var criteria = {accessToken: accessToken};
            var projection = {};
            var options = {limit: 1};
            Service.AdminService.getAdmin(criteria, projection, options, function(err, data) {
                if(err) {
                    callback(err);
                } else if (data && data.length > 0 && data[0]._id) {
                    callback(null, data[0]);
                } else {
                    callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_ACCESS_TOKEN);
                }
            });
        },
        function (adminData, callback) {
            var criteria = {_id: payload.recruiterID};
            var projection = {_id: 1, isBlocked: 1};
            var options = {limit: 1};
            Service.RecruiterService.getRecruiter(criteria, projection, options, function(err, data) {
                if(err) {
                    callback(err);
                } else if (data && data.length > 0 && data[0]._id) {
                    if(data[0].isBlocked == payload.isBlocked && payload.isBlocked) {
                        callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.ALREADY_BLOCKED);
                    } else if(data[0].isBlocked == payload.isBlocked && !payload.isBlocked) {
                        callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.ALREADY_UNBLOCKED);
                    } else {
                        callback(null, data[0]);
                    }
                } else {
                    callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.RECRUITER_NOT_FOUND);
                }
            });
        },
        function (interviewerData, callback) {
            var criteria = {_id: payload.recruiterID};
            var setQuery = {
                $set: {
                    isBlocked: payload.isBlocked
                }
            };
            var options = {lean: true};
            Service.RecruiterService.updateRecruiter(criteria, setQuery, options, callback);
        }
    ], function (error, success) {
        if (error) {
            callbackRoute(error);
        } else {
            callbackRoute(null, {});
        }
    })
};

/*
 ----------------------------------------
 SET QUANTITATIVE SCORE DATA
 ----------------------------------------
 */
var setQuantScoreData = function (accessToken, payload, callbackRoute) {

    var dataToSave = payload;
    async.auto({
        authenticate: function (callback) {
            var criteria = {accessToken: accessToken};
            var projection = {};
            var options = {limit: 1};
            Service.AdminService.getAdmin(criteria, projection, options, function(err, data) {
                if(err) {
                    callback(err);
                } else if (data && data.length > 0 && data[0]._id) {
                    callback(null, data[0]);
                } else {
                    callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_ACCESS_TOKEN);
                }
            });
        },
        getScoringData: ['authenticate', function (callback, results) {
            var criteria = {};
            var projection = {_id:1};
            var options = {limit: 1};
            Service.ScoreAlgoDataService.getScoreAlgoData(criteria, projection, options, function(err, data) {
                if(err) {
                    callback(err);
                } else if (data && data.length > 0 && data[0]._id) {
                    callback(null, data);
                } else {
                    callback(null, []);
                }
            });
        }],
        setScoringData: ['authenticate','getScoringData', function (callback, results) {
            if(results.getScoringData.length > 0) {
                dataToSave.updatedAt = new Date().toISOString();

                var criteria = {_id : results.getScoringData[0]._id};
                var setQuery = {
                    $set: dataToSave
                };
                var options = {lean: true};

                Service.ScoreAlgoDataService.updateScoreAlgoData(criteria, setQuery, options, function (err, data) {
                    callback(err, data);
                });
            } else {
                Service.ScoreAlgoDataService.insertScoreAlgoData(dataToSave, function (err, data) {
                    callback(err, data);
                });
            }
        }]
    }, function (error, success) {
        if (error) {
            callbackRoute(error);
        } else {
            callbackRoute(null, success.setScoringData);
        }
    })
};

/*
 ----------------------------------------
 GET QUANTITATIVE SCORE DATA
 ----------------------------------------
 */
var getQuantScoreData = function (accessToken, callbackRoute) {

    async.auto({
        authenticate: function (callback) {
            var criteria = {accessToken: accessToken};
            var projection = {};
            var options = {limit: 1};
            Service.AdminService.getAdmin(criteria, projection, options, function(err, data) {
                if(err) {
                    callback(err);
                } else if (data && data.length > 0 && data[0]._id) {
                    callback(null, data[0]);
                } else {
                    callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_ACCESS_TOKEN);
                }
            });
        },
        getScoringData: ['authenticate', function (callback, results) {
            var criteria = {};
            var projection = {};
            var options = {limit: 1};
            Service.ScoreAlgoDataService.getScoreAlgoData(criteria, projection, options, function(err, data) {
                if(err) {
                    callback(err);
                } else if (data && data.length > 0 && data[0]._id) {
                    callback(null, data[0]);
                } else {
                    callback(null, {});
                }
            });
        }]
    }, function (error, success) {
        if (error) {
            callbackRoute(error);
        } else {
            callbackRoute(null, success.getScoringData);
        }
    })
};

/*
 ----------------------------------------
 SET QUALITATIVE SCORE DATA
 ----------------------------------------
 */
var setQualScoreData = function (accessToken, payload, callbackRoute) {

    var dataToSave = payload;
    async.auto({
        authenticate: function (callback) {
            var criteria = {accessToken: accessToken};
            var projection = {};
            var options = {limit: 1};
            Service.AdminService.getAdmin(criteria, projection, options, function(err, data) {
                if(err) {
                    callback(err);
                } else if (data && data.length > 0 && data[0]._id) {
                    callback(null, data[0]);
                } else {
                    callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_ACCESS_TOKEN);
                }
            });
        },
        getScoringData: ['authenticate', function (callback, results) {
            var criteria = {};
            var projection = {_id:1};
            var options = {limit: 1};
            Service.ScoreAlgoDataService.getScoreAlgoData(criteria, projection, options, function(err, data) {
                if(err) {
                    callback(err);
                } else if (data && data.length > 0 && data[0]._id) {
                    callback(null, data);
                } else {
                    callback(null, []);
                }
            });
        }],
        setScoringData: ['authenticate','getScoringData', function (callback, results) {
            if(results.getScoringData.length > 0) {
                dataToSave.updatedAt = new Date().toISOString();

                var criteria = {_id : results.getScoringData[0]._id};
                var setQuery = {
                    $set: dataToSave
                };
                var options = {lean: true};

                Service.ScoreAlgoDataService.updateScoreAlgoData(criteria, setQuery, options, function (err, data) {
                    callback(err, data);
                });
            } else {
                Service.ScoreAlgoDataService.insertScoreAlgoData(dataToSave, function (err, data) {
                    callback(err, data);
                });
            }
        }]
    }, function (error, success) {
        if (error) {
            callbackRoute(error);
        } else {
            callbackRoute(null, success.setScoringData);
        }
    })
};

/*
 ----------------------------------------
 GET QUALITATIVE SCORE DATA
 ----------------------------------------
 */
var getQualScoreData = function (accessToken, callbackRoute) {

    async.auto({
        authenticate: function (callback) {
            var criteria = {accessToken: accessToken};
            var projection = {};
            var options = {limit: 1};
            Service.AdminService.getAdmin(criteria, projection, options, function(err, data) {
                if(err) {
                    callback(err);
                } else if (data && data.length > 0 && data[0]._id) {
                    callback(null, data[0]);
                } else {
                    callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_ACCESS_TOKEN);
                }
            });
        },
        getScoringData: ['authenticate', function (callback, results) {
            var criteria = {};
            var projection = {};
            var options = {limit: 1};
            Service.ScoreAlgoDataService.getScoreAlgoData(criteria, projection, options, function(err, data) {
                if(err) {
                    callback(err);
                } else if (data && data.length > 0 && data[0]._id) {
                    callback(null, data[0]);
                } else {
                    callback(null, {});
                }
            });
        }]
    }, function (error, success) {
        if (error) {
            callbackRoute(error);
        } else {
            callbackRoute(null, success.getScoringData);
        }
    })
};

/*
 ---------------------------------
 ADD FAQ
 ---------------------------------
 */
var addFAQ = function (accessToken, payload, callbackRoute) {

    async.waterfall([
        function (callback) {
            var criteria = {accessToken: accessToken};
            var projection = {_id: 1};
            var options = {limit: 1};
            Service.AdminService.getAdmin(criteria, projection, options, function(err, data) {
                if(err) {
                    callback(err);
                } else if (data && data.length > 0 && data[0]._id) {
                    callback(null, data[0]);
                } else {
                    callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_ACCESS_TOKEN);
                }
            });
        },
        function (adminData, callback) {
            var dataTosave = payload;

            Service.FAQService.insertFAQ(dataTosave, callback);
        }
    ], function (error, success) {
        if (error) {
            callbackRoute(error);
        } else {
            callbackRoute(null, success);
        }
    })
};

/*
 ---------------------------------
 EDIT FAQ
 ---------------------------------
 */
var editFAQ = function (accessToken, payload, callbackRoute) {

    async.waterfall([
        function (callback) {
            var criteria = {accessToken: accessToken};
            var projection = {_id: 1};
            var options = {limit: 1};
            Service.AdminService.getAdmin(criteria, projection, options, function(err, data) {
                if(err) {
                    callback(err);
                } else if (data && data.length > 0 && data[0]._id) {
                    callback(null, data[0]);
                } else {
                    callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_ACCESS_TOKEN);
                }
            });
        },
        function (adminData, callback) {
            var criteria = {_id : payload.FAQID};
            var projection = {};
            var options = {lean: true};

            Service.FAQService.getFAQ(criteria, projection, options, function (err, data) {
                if(err) {
                    callback(err);
                } else if(data && data.length > 0 && data[0]._id) {
                    callback(null, data[0])
                } else {
                    callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_ID);
                }
            });
        },
        function (faqData, callback) {
            var dataToUpdate = {
                question: payload.question,
                answer: payload.answer,
                userType: payload.userType,
                updatedAt: new Date().toISOString()
            };

            var criteria = {_id : payload.FAQID};
            var setQuery = {
                $set: dataToUpdate
            };
            var options = {lean: true};

            Service.FAQService.updateFAQ(criteria, setQuery, options, callback);
        }
    ], function (error, success) {
        if (error) {
            callbackRoute(error);
        } else {
            callbackRoute(null, success);
        }
    })
};

/*
 ---------------------------------
 GET FAQ LIST
 ---------------------------------
 */
var getFAQList = function (params, callbackRoute) {

    async.waterfall([
        function ( callback) {
            var criteria = {userType : params.userType};
            var projection = {};
            var options = {lean: true};
            Service.FAQService.getFAQ(criteria, projection, options, function (err, data) {
                callbackRoute( null, data);
            });
        }
    ], function (error, success) {
        if (error) {
            callbackRoute(error);
        } else {
            callbackRoute(null, success);
        }
    })
};

/*
 ---------------------------------
 DELETE FAQ
 ---------------------------------
 */
var deleteFAQ = function (accessToken, params, callbackRoute) {

    async.waterfall([
        function (callback) {
            var criteria = {accessToken: accessToken};
            var projection = {_id: 1};
            var options = {limit: 1};
            Service.AdminService.getAdmin(criteria, projection, options, function(err, data) {
                if(err) {
                    callback(err);
                } else if (data && data.length > 0 && data[0]._id) {
                    callback(null, data[0]);
                } else {
                    callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_ACCESS_TOKEN);
                }
            });
        },
        function (adminData, callback) {
            var criteria = {_id : params.FAQID};
            var projection = {};
            var options = {lean: true};

            Service.FAQService.getFAQ(criteria, projection, options, function (err, data) {
                if(err) {
                    callback(err);
                } else if(data && data.length > 0 && data[0]._id) {
                    callback(null, data[0]);
                } else {
                    callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_ID);
                }
            });
        },
        function (faqData, callback) {
            var criteria = {_id : params.FAQID};

            Service.FAQService.deleteFAQ(criteria, callback);
        }
    ], function (error, success) {
        if (error) {
            callbackRoute(error);
        } else {
            callbackRoute(null, {});
        }
    })
};

/*
 ----------------------------------------
 ADD Promocode 
 ----------------------------------------
 */
var addPromocode = function (accessToken, payload, callbackRoute) {

    var dataToSave = payload;
    async.waterfall([
        function (callback) {
            var criteria = {accessToken: accessToken};
            var projection = {};
            var options = {limit: 1};
            Service.AdminService.getAdmin(criteria, projection, options, function(err, data) {
                if(err) {
                    callback(err);
                } else if (data && data.length > 0 && data[0]._id) {
                    callback(null, data[0]);
                } else {
                    callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_ACCESS_TOKEN);
                }
            });
        },
        function (adminData, callback) {
            //Check plan already exist
            var criteria = {userType: payload.userType, promoName:payload.promoName };
            var projection = {};
            var options = {limit: 1};
            Service.PromoCodeService.getPromocode(criteria, projection, options, function(err, data) {
                if(err) {
                    callback(err);
                } else if (data && data.length > 0 && data[0]._id) {
                    if(payload.promoName ==data[0].promoName ) {
                        callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.BASIC_PLAN_ALREADY_EXIST);
                    } else {
                        callback(null);
                    }
                } else {
                    callback(null);
                }
            });
        },
        function (callback) {
            //Insert Into DB
            Service.PromoCodeService.insertPromocode(dataToSave, function (err, dataFromDB) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, dataFromDB);
                }
            })
        }
    ], function (error, success) {
        if (error) {
            callbackRoute(error);
        } else {
            callbackRoute(null, success);
        }
    })
};

/*
 ----------------------------------------
 GET Promocode 
 ----------------------------------------
 */

var getPromocodes = function (accessToken, params, callbackRoute) {
    var response = {
        CodeList : {}
    }
    async.waterfall([
        function (callback) {
            var criteria = {accessToken: accessToken};
            var projection = {};
            var options = {limit: 1};
            Service.AdminService.getAdmin(criteria, projection, options, function(err, data) {
                if(err) {
                    callback(err);
                } else if (data && data.length > 0 && data[0]._id) {
                    callback(null, data[0]);
                } else {
                    callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_ACCESS_TOKEN);
                }
            });
        },
        function (adminData, callback) {
            var criteria = { userType:params.type ,isAvailable: params.isactive };
            var projection = {};
            var options = {};
            Service.PromoCodeService.getPromocode(criteria, projection, options, function(err, data) {
                if(err) {
                    callback(err);
                } else if (data && data.length > 0) {
                    response.CodeList = data;
                    callback(null, response);
                } else {
                    callback(null, []);
                }
            });
        }
    ], function (error, success) {
        if (error) {
            callbackRoute(error);
        } else {
            callbackRoute(null, success);
        }
    })
};

/*
 ----------------------------------------
 UPDATE Promocode FOR RECRUITER
 ----------------------------------------
 */
var updatePromoCode = function (accessToken, payload, callbackRoute) {

    var dataToUpdate = payload;
    async.waterfall([
        function (callback) {
            var criteria = {accessToken: accessToken};
            var projection = {};
            var options = {limit: 1};
            Service.AdminService.getAdmin(criteria, projection, options, function(err, data) {
                if(err) {
                    callback(err);
                } else if (data && data.length > 0 && data[0]._id) {
                    callback(null, data[0]);
                } else {
                    callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_ACCESS_TOKEN);
                }
            });
        },
        function (adminData, callback) {
            //Check plan exist or not
            var criteria = {_id: payload.promoID};
            var projection = {};
            var options = {limit: 1};
            Service.PromoCodeService.getPromocode(criteria, projection, options, function(err, data) {
                if(err) {
                    callback(err);
                } else if (data && data.length > 0 && data[0]._id) {
                    callback(null);
                } else {
                    callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.MEMBERSHIP_PLAN_NOT_FOUND);
                }
            });
        },
         function (callback) {
            //Update Plan
            dataToUpdate.updatedAt = new Date().toISOString();

            var criteria = {_id: payload.promoID};
            var setQuery = {
                $set: dataToUpdate
            };
            var options = {lean: true};
            Service.PromoCodeService.updatePromocode(criteria, setQuery, options, callback);
        }
    ], function (error, success) {
        if (error) {
            callbackRoute(error);
        } else {
            callbackRoute(null, success);
        }
    })
};

/*
 ----------------------------------------
 UPDATE Promocode status
 ----------------------------------------
 */
var ChangePromocodeStatus = function (accessToken, payload, callbackRoute) {

    async.waterfall([
        function (callback) {
            var criteria = {accessToken: accessToken};
            var projection = {};
            var options = {limit: 1};
            Service.AdminService.getAdmin(criteria, projection, options, function(err, data) {
                if(err) {
                    callback(err);
                } else if (data && data.length > 0 && data[0]._id) {
                    callback(null, data[0]);
                } else {
                    callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_ACCESS_TOKEN);
                }
            });
        },
        function (adminData, callback) {
            //Check plan exist or not
            var criteria = {_id: payload.promoID};
            var projection = {};
            var options = {limit: 1};
            Service.PromoCodeService.getPromocode(criteria, projection, options, function(err, data) {
                if(err) {
                    callback(err);
                } else if (data && data.length > 0 && data[0]._id) {
                    callback(null);
                } else {
                    callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.MEMBERSHIP_PLAN_NOT_FOUND);
                }
            });
        },
         function (callback) {
            //Update Plan
            dataToUpdate = {};
            dataToUpdate.isAvailable = payload.activate;
            dataToUpdate.updatedAt = new Date().toISOString();

            var criteria = {_id: payload.promoID};
            var setQuery = {
                $set: dataToUpdate
            };
            var options = {lean: true};
            Service.PromoCodeService.updatePromocode(criteria, setQuery, options, callback);
        }
    ], function (error, success) {
        if (error) {
            callbackRoute(error);
        } else {
            callbackRoute(null, success);
        }
    })
};
/* 
add Interview Charge;
*/

var ManageInterviewCharge = function (params, callbackRoute) {

    async.waterfall([
        function (callback) {
            //Check plan already exist
            var criteria = {};
            var projection = {};
            var options = {};
            Service.InterviewChargeService.getCharges(criteria, projection, options, function(err, data) {
                if(err) {
                    callback(err);
                } else if (data && data.length > 0 && data[0]._id) {
                    callback(null, {type:'update',id :data[0]._id} );
                } else {
                    callback(null, {type:'insert' } );
                }
            });
        },
        function ( Charge_data, callback) {
            //Insert Into DB
            if( Charge_data.type == "insert"){
                dataToSave = { candidateInterviewCharges: params.candidateInterviewCharges }
                Service.InterviewChargeService.insertCharge(dataToSave, function (err, dataFromDB) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, dataFromDB[0]);
                    }
                })
            }
            if( Charge_data.type == "update"){
                var criteria = { _id :Charge_data.id  };
                var dataToset = { candidateInterviewCharges: params.candidateInterviewCharges };
                var options = {};
                Service.InterviewChargeService.updateCharge(criteria,dataToset,options, function (err, dataFromDB) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, dataFromDB[0]);
                    }
                })
            }
        }
    ], function (error, success) {
        if (error) {
            callbackRoute(error);
        } else {
            callbackRoute(null, success);
        }
    })
};

/* 
GET Interview Charge;
*/

var getInterviewCharge = function ( callbackRoute) {

    async.waterfall([
        function (callback) {
            //Check plan already exist
            var criteria = {};
            var projection = {};
            var options = {};
            Service.InterviewChargeService.getCharges(criteria, projection, options, function(err, data) {
                if(err) {
                    callback(err);
                } else if (data && data.length ) {
                    callback(null, data[0] );
                } else {
                    callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.CHARGES_NOT_FOUND);
                }
            });
        }
    ], function (error, success) {
        if (error) {
            callbackRoute(error);
        } else {
            callbackRoute(null, success);
        }
    })
};


/*
 ----------------------------------------
 ADD  CANDIDATE MEMBERSHIP
 ----------------------------------------
 */
var addCandidateMembership = function (accessToken, payload, callbackRoute) {

    var dataToSave = payload;
    async.waterfall([
        function (callback) {
            var criteria = {accessToken: accessToken};
            var projection = {};
            var options = {limit: 1};
            Service.AdminService.getAdmin(criteria, projection, options, function(err, data) {
                if(err) {
                    callback(err);
                } else if (data && data.length > 0 && data[0]._id) {
                    callback(null, data[0]);
                } else {
                    callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_ACCESS_TOKEN);
                }
            });
        },
        function ( data, callback) {
            //Insert Into DB
            Service.CandidateMembershipService.insertMembershipPlan(dataToSave, function (err, dataFromDB) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, dataFromDB);
                }
            })
        }
    ], function (error, success) {
        if (error) {
            callbackRoute(error);
        } else {
            callbackRoute(null, success);
        }
    })
};

/*
 ----------------------------------------
 UPDATE Candidate membership
 ----------------------------------------
 */
var updatecandidateMembership = function (accessToken, payload, callbackRoute) {

    async.waterfall([
        function (callback) {
            var criteria = {accessToken: accessToken};
            var projection = {};
            var options = {limit: 1};
            Service.AdminService.getAdmin(criteria, projection, options, function(err, data) {
                if(err) {
                    callback(err);
                } else if (data && data.length > 0 && data[0]._id) {
                    callback(null, data[0]);
                } else {
                    callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_ACCESS_TOKEN);
                }
            });
        },
        function (adminData, callback) {
            //Check plan exist or not
            var criteria = {_id: payload.memID};
            var projection = {};
            var options = {limit: 1};
            Service.CandidateMembershipService.getMembershipPlan(criteria, projection, options, function(err, data) {
                if(err) {
                    callback(err);
                } else if (data && data.length > 0 && data[0]._id) {
                    callback(null);
                } else {
                    callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.MEMBERSHIP_PLAN_NOT_FOUND);
                }
            });
        },
         function (callback) {
            //Update Plan
            dataToUpdate = payload;

            var criteria = {_id: payload.memID};
            var setQuery = {
                $set: dataToUpdate
            };
            var options = {lean: true};
            Service.CandidateMembershipService.updateMembershipPlan(criteria, setQuery, options, callback);
        }
    ], function (error, success) {
        if (error) {
            callbackRoute(error);
        } else {
            callbackRoute(null, success);
        }
    })
};

var updateInterviewcharge = function (accessToken, payload, callbackRoute) {
    async.waterfall([
        function (callback) {
            var criteria = {accessToken: accessToken};
            var projection = {};
            var options = {limit: 1};
            Service.AdminService.getAdmin(criteria, projection, options, function(err, data) {
                if(err) {
                    callback(err);
                } else if (data && data.length > 0 && data[0]._id) {
                    callback(null, data[0]);
                } else {
                    callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_ACCESS_TOKEN);
                }
            });
        },
        function (adminData, callback) {
            //Check plan exist or not
            var criteria = {_id: payload.interviewerID};
            var dataTosave= { interviewCharge :payload.interviewCharge };
            Service.InterviewerService.updateInterviewer(criteria, dataTosave, {}, function(err, data) {
                if(err) {
                    callback(err);
                } else {
                    callback(null, 'success' );
                }
            });
        }
    ], function (error, success) {
        if (error) {
            callbackRoute(error);
        } else {
            callbackRoute(null, success);
        }
    })
};

var revaluationRequest = function (accessToken, payload, callbackRoute) {
    var candidateDetails;
    var currentDate = UniversalFunctions.getDateTime();
    var dateArr = currentDate.split('/');
    var admindata ;

    async.waterfall([
        function (callback) {
            var criteria = {accessToken: accessToken};
            var projection = {};
            var options = {limit: 1};
            Service.AdminService.getAdmin(criteria, projection, options, function(err, data) {
                if(err) {
                    callback(err);
                } else if (data && data.length > 0 && data[0]._id) {
                    admindata = data[0];
                    callback(null, data[0]);
                } else {
                    callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_ACCESS_TOKEN);
                }
            });
        },
        function (adminData, callback) {
            //Check plan exist or not
            var criteria = {_id: payload.candidateID};
            Service.CandidateService.getCandidate(criteria, {},{ lean:true}, function(err, data) {
                if(err) {
                    callback(err);
                } else if (data && data.length > 0 && data[0]._id) {
                    candidateDetails= data[0];
                    callback(null, data[0]);
                } else {
                    callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_ACCESS_TOKEN);
                }
            });
        },
        function (candidateDetails, callback) {
                if( candidateDetails.interviewshiptaken == false ){
                    if( candidateDetails.InterviewsTaken != undefined && candidateDetails.InterviewsTaken == 1 ){
                        var criteria = { _id:payload.candidateID  };
                        var dataTosave = { revaluation :true, interviewshiptaken:true, revaluationDate : new Date().toISOString() };
                        
                        dataTosave["lastPaidBy.userType"]='ADMIN';
                        dataTosave["lastPaidBy.userId"]=admindata._id;
                        dataTosave["lastPaidBy.paymentId"] = null;

                        Service.CandidateService.updateCandidate( criteria, dataTosave, function (err, interviewData) {
                            if (err) {
                                callback(err);
                            } else {
                                callback(null, "interview assigned");
                            }
                        });
                    }else{
                        callback( "Candidate taken interviews "+ candidateDetails.InterviewsTaken );
                    }
            }else{
                callback( "Candidate already taken membership" );
            }
        },
        function( int, callback ){
                if( int ==  "interview assigned" ){
                    var criteria = { 
                            userType:'ADM-CAND',
                            amount:0,
                            paymentId:null,
                            userId: candidateDetails._id
                    };
                    Service.PaymentService.insertPayment(criteria, function(err, data) {
                            if(err){
                                console.log( "payment controller", err );
                            }else{
                                var variableDetails = {
                                    subject :'Interview  Notifications',
                                    html  : "Hi "+candidateDetails.firstName+ ", Admin paid revaluation fees. Please go for a interview."
                                };
                                NotificationManager.sendEmailToUser('ALERTS', variableDetails, candidateDetails.email, function( err, data ){
                                });
                            }
                            callback( null, 'interview assigned' );
                    });
                }
        }
    ], function (error, success) {
        if (error) {
            callbackRoute(error);
        } else {
            callbackRoute(null, success);
        }
    })
};

var getRevaluationData = function (accessToken, params, callbackRoute) {
    var candidateDetails;
    var currentDate = UniversalFunctions.getDateTime();
    var dateArr = currentDate.split('/');
    var response = {
        totalCount: 0,
        interviewList: []
    };
    async.waterfall([
        function (callback) {
            var criteria = {accessToken: accessToken};
            var projection = {};
            var options = {limit: 1};
            Service.AdminService.getAdmin(criteria, projection, options, function(err, data) {
                if(err) {
                    callback(err);
                } else if (data && data.length > 0 && data[0]._id) {
                    callback(null, data[0]);
                } else {
                    callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_ACCESS_TOKEN);
                }
            });
        },
        function (adminData, callback) {
            //Check plan exist or not
                var criteria = {
                   revaluation:true
                };
                var projection = {};
                var options = {
                    limit : params.limit,
                    skip : params.start,
                    lean: true,
                    sort: { createdAt:-1}
                };
                var pop1 = {
                    path: 'candidateID',
                    select: "firstName lastName profilePicURL phoneNo profilePicURL countryCode email"
                }
                var pop2 = {
                    path: 'interviewerID',
                    select: "firstName lastName profilePicURL phoneNo profilePicURL countryCode email"
                }
                Service.InterviewDetailService.getInterviewWithtwoPopulation(criteria, projection,options, pop1, pop2, function(err, data) {
                    if(err) {
                        console.log( "error", err);
                        callback(err);
                    } else if (data && data.length > 0) {
                        response.interviewList = data; 
                        callback(null, response );
                    } else {
                        callback(null,{});
                    }
                });
        },
        function ( Data_res, callback) {
                var criteria = {
                   revaluation:true
                };
                Service.InterviewDetailService.countInterviewDetails(criteria,  function(err, data) {
                    if(err) {
                        console.log( "error", err);
                        callback(err);
                    } else {
                        response.totalCount = data; 
                        callback(null, response );
                    }
                });
        },
    ], function (error, success) {
        if (error) {
            callbackRoute(error);
        } else {
            callbackRoute(null, success);
        }
    })
};

module.exports = {
    verifyInterviewerProfile: verifyInterviewerProfile,
    blockUnblockInterviewer: blockUnblockInterviewer,
    addMembershipPlan: addMembershipPlan,
    updateRecruiterMembershipPlan: updateRecruiterMembershipPlan,
    getRecruiterMembershipPlan: getRecruiterMembershipPlan,
    deleteRecruiterMembershipPlan: deleteRecruiterMembershipPlan,
    blockUnblockCandidate: blockUnblockCandidate,
    blockUnblockRecruiter: blockUnblockRecruiter,
    setQuantScoreData: setQuantScoreData,
    getQuantScoreData: getQuantScoreData,
    setQualScoreData: setQualScoreData,
    getQualScoreData: getQualScoreData,
    addFAQ: addFAQ,
    editFAQ: editFAQ,
    getFAQList: getFAQList,
    deleteFAQ: deleteFAQ,
    addPromocode:addPromocode,
    getPromocodes: getPromocodes,
    updatePromoCode:updatePromoCode,
    ChangePromocodeStatus:ChangePromocodeStatus,
    ManageInterviewCharge:ManageInterviewCharge,
    getInterviewCharge:getInterviewCharge,
    addCandidateMembership:addCandidateMembership,
    updatecandidateMembership:updatecandidateMembership,
    updateInterviewcharge : updateInterviewcharge,
    revaluationRequest:revaluationRequest,
    getRevaluationData:getRevaluationData
};