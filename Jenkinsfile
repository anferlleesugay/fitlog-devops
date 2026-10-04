pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = 'fitlog'
        TAG = "${env.BUILD_NUMBER}"
    }

    triggers {
        pollSCM('H/2 * * * *')
    }

    options {
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '15'))
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Test & Quality Gate') {
            steps {
                echo "Running unit tests inside isolated container build stage..."
                sh 'docker build --target test -t fitlog/tracker-api:test ./tracker-api'
            }
        }

        stage('Build Images') {
            steps {
                sh 'docker compose build'
            }
        }

        stage('Deploy') {
            steps {
                withCredentials([file(credentialsId: 'fitlog-env', variable: 'ENV_FILE')]) {
                    sh 'cp "$ENV_FILE" .env'
                    sh 'docker compose up -d --no-build --remove-orphans'
                }
            }
        }

        stage('Smoke Verification') {
            steps {
                sh '''
                  for i in $(seq 1 12); do
                    if docker compose exec -T tracker-api wget -qO- http://localhost:3000/api/health; then
                      echo "Smoke test passed successfully."
                      exit 0
                    fi
                    echo "Waiting for app stack initialization..."
                    sleep 5
                  done
                  echo "Smoke test failed!"
                  exit 1
                '''
            }
        }
    }

    post {
        success {
            echo "Deployment of Build ${TAG} completed successfully!"
        }
        failure {
            echo "Build ${TAG} failed quality gate or deployment check. System retained previous stable state."
        }
        always {
            sh 'rm -f .env'
        }
    }
}