def buildApp() {
    sh 'echo $(pwd)'
    sh 'mvn clean package --file */pom.xml'
}

def sendArtifactToS3() {
    sh 'aws s3 cp ${WORKSPACE}/${BACKEND_FOLDER}/target/*.war s3://${AWS_S3_BUCKET}'
}

return this
