@Library('pipelines') _

npmFullPipeline(
  appName: params.APP_NAME, 
  gitBranch: params.GIT_BRANCH, 
  gitCredentials: params.GIT_CREDENTIALS, 
  gitUrl: params.GIT_URL,
  buildProject: params.BUILD_PROJECT,
  uatProject: params.UAT_PROJECT,
  prodProject: params.PROD_PROJECT,
  baseImage: params.BASE_IMAGE,
  buildTag: params.BUILD_TAG,
  deployTag: params.DEPLOY_TAG,
  testStrategy: params.STRATEGY
  )