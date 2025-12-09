pipeline {
    agent any

    environment {
        SSH_CREDENTIALS_ID = 'ubuntu-ssh-key'
        REMOTE_USER = 'ubuntu'
        REMOTE_HOST = '34.235.150.148'
        APP_HOME = '/home/ubuntu/jenkins-public'
    }

    stages {
        stage('Deploy to Remote Server') {
            steps {
                sshagent([SSH_CREDENTIALS_ID]) {
                    sh """
ssh -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_HOST} << EOF
echo "🚀 Starting Deployment..."

# ===== FLASK APP =====
cd ${APP_HOME}/flask-app || { echo "❌ Flask folder missing"; exit 1; }

# Create virtual environment if missing
if [ ! -d venv ]; then
    python3 -m venv venv
fi

# Activate venv
source venv/bin/activate

# Install requirements
pip install --break-system-packages -r requirements.txt

# Kill previous Flask PM2 process if exists
pm2 delete flask-app || true

# Start Flask with PM2
pm2 start "venv/bin/gunicorn app:app --bind 0.0.0.0:5000" --name flask-app

deactivate
echo "✅ Flask app deployed!"

# ===== NODE APP =====
cd ${APP_HOME}/node-app || { echo "❌ Node folder missing"; exit 1; }

# Install Node packages
npm install --force

# Restart Node app using PM2
pm2 delete node-app || true
pm2 start app.js --name node-app

# Save PM2 process list so apps restart on reboot
pm2 save

echo "✅ Node app deployed successfully!"
EOF
                    """
                }
            }
        }
    }

    post {
        failure {
            echo "❌ Deployment failed! Check the logs on the remote server."
        }
    }
}
