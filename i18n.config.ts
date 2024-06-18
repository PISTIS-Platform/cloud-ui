export default defineI18nConfig(() => ({
    legacy: false,
    numberFormats: {
        en: {
            decimal: {
                style: 'decimal',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            },
            percent: {
                maximumFractionDigits: 2,
                maximumSignificantDigits: 3,
                style: 'percent',
                useGrouping: false,
            },
        },
    },
    datetimeFormats: {
        en: {
            short: {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            },
        },
    },
    messages: {
        en: {
            download: 'Download',
            submit: 'Submit',
            addNew: 'Add New',
            signIn: 'Sign In',
            signOut: 'Sign Out',
            create: 'Create',
            search: 'Search',
            areYouSure: 'Are you sure?',
            yes: 'Yes',
            cancel: 'Cancel',
            required: 'Required',
            save: 'Save',
            reset: 'Reset',
            delete: 'Delete',
            goBack: 'Go Back',
            title: 'Title',
            dashboard: {
                dashboard: 'Dashboard',
                status: 'Status',
                resources: {
                    name: 'Resources',
                    title: 'Resources & Activities Monitor',
                    componentStatus: 'Component Status',
                    resourceUsage: 'Resource Usage',
                    platformActivities: 'Platform Activities',
                    sinceLastWeek: 'since last week',
                    sinceLastMonth: 'since last month',
                    transactions: 'Transactions',
                    weeklyTransactions: 'Weekly Transactions',
                    weeklyMoney: 'Weekly Money Circulated',
                    usageStats: {
                        cpuUsage: 'CPU Usage',
                        diskUtilisation: 'Disk Utilisation',
                        memoryUtilisation: 'Memory Utilisation',
                        from: 'from',
                        cores: 'cores',
                    },
                    tableFields: {
                        asset: 'Asset',
                        date: 'Transaction Date',
                        plan: 'Monetisation Plan',
                        transactionId: 'Transaction ID',
                    },
                    cardsFields: {
                        total: 'Total',
                        inUse: 'In Use',
                        factories: 'Registered Factories',
                        users: 'Registered Users',
                        assets: 'Total Assets',
                    },
                },
            },
            registry: {
                registration: {
                    title: 'Factory Registration',
                    welcome: 'Welcome to the Factory Registration page. Please follow these steps to get started:',
                    downloadInstructions: 'Download the deployment instructions for your factory',
                    downloadConfig: 'Download the required configuration for your individual factory',
                    defineIP: 'Define the public IP of the factory once it is up and running',
                    enterIP: "Enter the factory's public IP",
                    invalidIP: 'Invalid IP Address',
                    errorInDownloadingInstructions: 'Error occurred in downloading instructions',
                    errorInDownloadingConfigurations: 'Error occurred in downloading your individual configurations',
                },
                createFactory: 'Create Factory',
                registry: 'Factory Registry',
                info: '',
                title: 'Factory Registry Manager',
                organizationName: 'Organization Name',
                organizationId: 'Organization ID',
                factoryPrefix: 'Factory Prefix',
                name: 'Name',
                ip: 'IP Address',
                country: 'Country',
                status: 'Status',
                activate: 'Activate',
                deactivate: 'Deactivate',
                accept: 'Accept',
                deny: 'Deny',
                factoryAccepted: 'Factory Accepted',
                factoryAcceptanceError: 'Factory acceptance error',
                factoryActivationError: 'Factory activation/deactivation error',
                factoryDenied: 'Factory Denied',
                factoryModal: 'Please choose to register new factory',
            },
            validation: {
                atLeastNumberChars: 'Must be at least {count} characters',
                validNumber: 'Please enter a valid number',
                zeroOrPositive: 'Must be 0 or a positive number',
                positive: 'Must be a positive number',
                moreThanNumberChars: 'Cannot be more than {count} characters',
            },
            'usage-analytics': {
                'usage-analytics': 'Usage Analytics',
                overview: 'Overview',
                questionnaires: 'Questionnaires',
                selectType: 'Select Questionnaire Type',
                questionnaire: 'Questionnaire',
                generalQuestionnaire: 'General Questionnaire',
                generalQuestionnaireInfo: 'General Questionnaire for all users',
                assetsQuestionnaire: 'Assets Questionnaire',
                forVerifiedBuyers: 'For Verified Buyers',
                assetsQuestionnaireInfo: 'Questionnaire for verified buyers, for all assets',
                errorWhileRetrieving: 'Error occurred while retrieving questionnaire data',
                build: 'Build Questionnaire',
                versionsTitle: 'Questionnaire Versions',
                noVersionsExist: 'No questionnaires available',
                createNew: 'Create New Questionnaire',
                createNewVersion: 'Create New Questionnaire Version',
                createNewVersionFromExisting: 'Create new based on this version',
                deleteVersion: 'Delete version',
                deleteVersionInfo: 'This action will delete this version and all its related questions',
                edit: 'Edit Questionnaire',
                reset: 'Reset Questionnaire',
                save: 'Save Questionnaire',
                submitAnswers: 'Submit Answers',
                title: 'Title',
                version: 'Version',
                description: 'Description',
                publicationDate: 'Publication Date',
                isActive: 'Is Active',
                isOptional: 'Is Optional',
                titleInfo: 'Enter a title for the questionnaire',
                descriptionInfo: 'Enter a description for the questionnaire',
                answerQuestionnaire: 'Answer Questionnaire',
                activate: 'Activate Questionnaire',
                activateAndPublish: 'Activate Questionnaire (this will also publish it)',
                deactivate: 'Deactivate Questionnaire',
                publish: 'Publish Questionnaire',
                unpublish: 'Unpublish Questionnaire',
                buildInfo: 'Build the questionnaire for selected dataset',
                answerInfo: 'Answer the questionnaire for selected dataset',
                selectQuestionType: 'Select Question Type',
                questionTitle: 'Question Title',
                isRequired: 'Is Required',
                optionText: 'Option Text',
                options: 'Options',
                addQuestion: 'Add Question',
                removeQuestion: 'Remove Question',
                numberingOptions1to5: 'Rating Options (1 - 5)',
                scaleTextOptions: 'Rating Scale (Extremely Poor to Excellent)',
                scaleTextExtremelyPoor: 'Extremely Poor',
                scaleTextPoor: 'Poor',
                scaleTextNeutral: "I'm not sure",
                scaleTextGreat: 'Great',
                scaleTextExcellent: 'Excellent',
                addCustomOption: 'Add Custom Option',
                addPreconfiguredOptions: 'Add pre-configured options',
                addOption: 'Add Option',
                removeOption: 'Remove Option',
                optionTextRequired: 'Option text is required',
                optionsMinLength: 'Please select at least 2 options for answers',
                checkInputs: 'Please ensure all fields are filled correctly before submitting the form',
                atLeastOneQuestionRequired: 'At least one question should be required',
                noQuestionsAdded: 'Please add at least one question first',
                selectedOptionsMinLength: 'Please select at least one option',
                saved: 'Questionnaire has been saved successfully!',
                updated: 'New Questionnaire version has been created successfully!',
                deleted: 'Questionnaire version has been deleted successfully!',
                cannotDelete: 'You cannot delete the questionnaire, as there are already responses collected',
                deactivated: 'Questionnaire version has been deactivated successfully!',
                activated: 'Questionnaire version has been activated successfully!',
                activationInfo:
                    'Please note that this will deactivate other versions since you can only have one version activated',
                savedAnswers: 'Answers have been submitted successfully!',
                errorInSave: 'An error occurred while saving questionnaire',
                errorInDeletion: 'An error occurred while deleting questionnaire version',
                errorInFindVersion: 'An error occurred while retrieving questionnaire version',
                errorWhileRetrievingActiveVersion: 'An error occurred while retrieving questionnaire',
                errorInActivation: 'An error occurred while activating questionnaire version',
                errorInDeactivation: 'An error occurred while deactivating questionnaire version',
                noActiveQuestionnaireFound: 'No Questionnaire was found',
                answerTextInfo: 'Enter your answer',
            },
            models: {
                models: 'Models Repository',
                overview: 'Models List',
                upload: 'Upload',
                dmRepository: {
                    title: 'Models Management',
                    view: 'View',
                    edit: 'Edit',
                    save: 'Save',
                    editModelWithID: 'Edit Model with ID',
                    delete: 'Delete',
                    download: 'Download',
                    dmAddTitle: 'Add Model',
                    upload: 'Upload New Model',
                    select: 'Select file',
                    drag: 'or drag and drop',
                    noFile: 'No file selected',
                    fileName: 'File name:',
                    invalid: 'Invalid file type.',
                    uploadButton: 'Upload',
                    formTitle: 'Title:',
                    formVersion: 'Version:',
                    formDescription: 'Description:',
                    search: 'Search...',
                    addDataset: 'Add new model',
                    addDataModel: 'Add new model',
                    modelType: 'Model type',
                    tableFields: {
                        id: 'ID',
                        title: 'Title',
                        date: 'Date',
                        size: 'Size (MB)',
                        version: 'Version',
                        country: 'Country',
                        type: 'Model Type',
                    },
                    modelTypes: {
                        dataModel: 'Data Model',
                        metadataModel: 'Metadata Model',
                        monetisationModel: 'Monetisation Model',
                        pretrainedAIModel: 'Pre-trained AI Model',
                    },
                },
            },
        },
    },
}));
