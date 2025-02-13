import { countriesInEnglish } from './constants/countries';

export default defineI18nConfig(() => {
    return {
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
                balance: 'Balance',
                home: 'Home',
                marketplace: 'Marketplace',
                distributedQuery: 'Distributed Query',
                download: 'Download',
                submit: 'Submit',
                addNew: 'Add New',
                signIn: 'Sign In',
                signOut: 'Sign Out',
                create: 'Create',
                search: 'Search',
                areYouSure: 'Are you sure?',
                yes: 'Yes',
                no: 'No',
                cancel: 'Cancel',
                required: 'Required',
                string: 'Input must be a string',
                invalidUUID: 'Invalid UUID',
                save: 'Save',
                edit: 'Edit',
                reset: 'Reset',
                delete: 'Delete',
                goBack: 'Go Back',
                title: 'Title',
                firstName: 'First Name',
                lastName: 'Last Name',
                email: 'Email',
                emailOfAdmin: "Email of the organization's admin",
                auditor: {
                    title: 'Transaction Auditor',
                    date: 'Date',
                    transactionId: 'Transaction ID',
                    assetId: 'Asset ID',
                    assetTitle: 'Asset Title',
                    amount: 'Full Amount',
                    amountToProvider: 'Amount to Data Provider',
                    transactionFee: 'Transaction Fee',
                    terms: 'Terms and Conditions',
                    provider: 'Provider',
                    consumer: 'Consumer',
                    type: 'Type',
                    assetDetails: 'Asset Details',
                    transactionDetails: 'Transaction Details',
                    noTransactionSelected: 'No transaction selected',
                    link: 'Asset Link (Marketplace)',
                    downloadPDF: 'Download as PDF',
                },
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
                            cpuAndMemory: 'CPU and Memory Utilisation',
                            disk: 'Disk Usage',
                            cpu: 'CPU',
                            memory: 'Memory',
                            from: 'from',
                            cores: 'cores',
                            mongoDb: 'MongoDB',
                            elasticSearchAvg: 'Elasticsearch',
                            esInstance1: 'Instance 1',
                            esInstance2: 'Instance 2',
                            esInstance3: 'Instance 3',
                            postgres: 'PostgreSQL',
                            minio: 'MinIO',
                            errorInRetrievingCpuAndMemoryStats:
                                'Error occurred while retrieving CPU and Memory usage stats',
                            errorInRetrievingDiskUsageStats: 'Error occurred while retrieving Disk usage stats',
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
                    statuses: {
                        pending: 'Pending',
                        online: 'Online',
                        offline: 'Offline',
                        suspended: 'Suspended',
                    },
                    registration: {
                        title: 'Factory Registration',
                        welcome: 'If you have not already configured your factory, please follow the steps below:',
                        downloadInstructions: 'Download the deployment instructions for your factory',
                        downloadConfig: 'Download the required configuration for your individual factory',
                        defineIP: 'Define the public IP of the factory once it is up and running',
                        enterIP: "Enter the factory's public IP",
                        invalidIP: 'Invalid IP Address',
                        errorInDownloadingInstructions: 'Error occurred in downloading instructions',
                        errorInDownloadingConfigurations:
                            'Error occurred in downloading your individual configurations',
                        errorWhileRetrievingUserFactory:
                            'Error occurred while retrieving factory. Please check if your organization has a registered factory',
                    },
                    servicesRegistry: {
                        title: 'Services Registry',
                        createNew: 'Register new Service',
                        updateService: 'Update Service',
                        update: 'Update Service',
                        serviceName: 'Service Name',
                        serviceUrl: 'Service URL',
                        noServicesExist: 'No registered services available',
                        saved: 'New service mapping has been saved successfully!',
                        updated: 'Service mapping has been updated successfully!',
                        errorInRetrieval: 'An error occurred while retrieving the registered services',
                        errorInFindingServiceMapping: 'An error occurred while retrieving the service mapping',
                        errorInSave: 'An error occurred while saving a service mapping',
                        errorInUpdate: 'An error occurred while updating the service mapping',
                        invalidServiceUrl: 'Service URL can only contain alphanumeric characters, "/" and "-"',
                        sar: 'Service account role',
                    },
                    types: {
                        sme: 'Small Medium Enterprise',
                        academic: 'Academic / Research',
                        publicBody: 'Public Body',
                    },
                    domains: {
                        education: 'Education',
                        transportation: 'Transportation',
                        consumerGoods: 'Consumer Goods',
                        electricity: 'Electricity',
                        oilAndGas: 'Oil and Gas',
                        healthcare: 'Healthcare',
                        consumerFinance: 'Consumer Finance',
                    },
                    countries: countriesInEnglish,
                    sizes: {
                        small: 'Small',
                        medium: 'Medium',
                        large: 'Large',
                    },
                    searchForACountry: 'Search for a country',
                    pleaseCheckForm: 'Please check and input all necessary fields of the form',
                    createFactory: 'Create Factory',
                    registry: 'Factory Registry',
                    type: 'Type',
                    domain: 'Domain',
                    country: 'Country',
                    size: 'Size',
                    select: 'Select',
                    info: '',
                    noIp: 'No IP provided yet',
                    title: 'Factory Registry Manager',
                    organizationAdmin: "Organization's Admin",
                    organizationName: 'Organization Name',
                    organizationNamePlaceholder: 'The name of the organization',
                    organizationId: 'Organization ID',
                    organizationIdPlaceholder:
                        'The UUID for the organization (e.g. 5e05e3b8-6518-4c4a-b049-ebdfd70cb54a)',
                    factoryPrefix: 'Factory Prefix',
                    factoryPrefixPlaceholder: 'factory-name',
                    name: 'Name',
                    ip: 'IP Address',
                    ipPlaceholder: "The organization's public IP address (e.g. 192.168.1.1)",
                    noIpProvided: 'No IP has been provided yet so the factory cannot be activated',
                    countryPlaceholder: 'GR',
                    status: 'Status',
                    activate: 'Activate',
                    deactivate: 'Deactivate',
                    suspend: 'Suspend',
                    accept: 'Accept',
                    deny: 'Deny',
                    factoryCreated: 'Factory successfully created',
                    factoryError: 'There was an error and the factory was not created',
                    factoryAccepted: 'Factory Accepted',
                    errorInRetrievingFactories: 'Error occurred while retrieving factories',
                    factoryAcceptanceError: 'Factory acceptance error',
                    factoryActivationError: 'Factory activation/deactivation error',
                    factoryDenied: 'Factory Denied',
                    factoryModal: 'Please choose to register new factory',
                    areYouSureActivate: 'Are you sure you would like to activate this factory?',
                    areYouSureSuspend: 'Are you sure you would like to suspend this factory?',
                    areYouSureRecreate: 'Are you sure you would like to recreate the services for this factory?',
                    factoryActivated: 'Factory successfully activated',
                    factorySuspended: 'Factory successfully suspended',
                    IPUpdated: 'IP successfully updated',
                    IPSubmitError: 'Error occurred while updating the IP',
                    actions: 'Actions',
                    recreate: 'Recreate',
                    factoryRecreateSuccess: 'Factory services recreated successfully',
                    factoryRecreateError: 'Error occurred while factory services recreation',
                },
                validation: {
                    atLeastNumberChars: 'Must be at least {count} characters',
                    validNumber: 'Please enter a valid number',
                    zeroOrPositive: 'Must be 0 or a positive number',
                    positive: 'Must be a positive number',
                    moreThanNumberChars: 'Cannot be more than {count} characters',
                    validValue: 'Must be a valid {name}',
                    required: 'Required',
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
                    checkAnswers: 'Please ensure all answers are filled correctly before submitting the form',
                    submitAnswers: 'Submit Answers',
                    answersSubmitted: 'Your answers have been submitted successfully',
                    errorInSubmitAnswers: 'Error occurred while submitting answers',
                    noQuestionsWereFound: 'No questions were found for this questionnaire',
                },
                models: {
                    models: 'Models Repository',
                    overview: 'Models List',
                    upload: 'Upload',
                    successUpload: 'Model has been uploaded successfully',
                    successEdit: 'Model has been updated successfully',
                    successDelete: 'Model has been deleted successfully',
                    deleteModelDescription: 'Are you sure you want to delete this model?',
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
                    errors: {
                        retrieveList: 'Error occurred while retrieving models list',
                        upload: 'Error occurred while uploading the model',
                        edit: 'Error occurred while updating the model',
                        download: 'Error occurred while downloading the model',
                        delete: 'Error occurred while deleting the model',
                        loadingList: 'Error while loading models list',
                        version: 'Please enter a version',
                        validFile: 'Please upload a valid file',
                    },
                },
                wallet: {
                    wallet: 'Wallet',
                    amount: 'Amount',
                    date: 'Transaction Date',
                    transaction: 'Transaction ID',
                    balance: 'Balance',
                    noTransactions: 'No transactions available',
                    balanceInMonth: 'this month',
                },
                notifications: {
                    notifications: 'Notifications',
                    title: 'Notifications',
                    markRead: 'Mark as read',
                    hide: 'Hide',
                    noNotifications: 'No notifications available.',
                    refund: 'Refund',
                },
            },
        },
    };
});
