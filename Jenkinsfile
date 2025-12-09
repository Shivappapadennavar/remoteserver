pipeline {
    agent any

    environment {
        SSH_CREDENTIALS_ID = 'ubuntu-ssh-key'
        REMOTE_USER = 'ubuntu'
        REMOTE_HOST = '34.235.150.148'
        APP_HOME = '/home/ubuntu/remoteserver'   // 🔥 UPDATED PATH
    }

    stages {
        stage('Deploy to Remote Server') {
            steps {
                sshagent([SSH_CREDENTIALS_ID]) {
                    sh """
ssh -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_HOST} << EOF
echo "🚀 Starting Deployment..."

# =============================================================
#                       FLASK APP
# =============================================================
cd ${APP_HOME}/flask-app || { echo "❌ Flask folder missing"; exit 1; }

# Create virtual environment if missing
if [ ! -d venv ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate venv
source venv/bin/activate

echo "📦 Installing Flask dependencies..."
pip install --break-system-packages -r requirements.txt

echo "🔁 Restarting Flask app with PM2..."
pm2 delete flask-app || true
pm2 start "venv/bin/gunicorn app:app --bind 0.0.0.0:5000" --name flask-app

deactivate
echo "✅ Flask app deployed!"

# =============================================================
#                       NODE APP
# =============================================================
cd ${APP_HOME}/node-app || { echo "❌ Node folder missing"; exit 1; }

echo "📦 Installing Node dependencies..."
npm install --force

echo "🔁 Restarting Node app with PM2..."
pm2 delete node-app || true
pm2 start app.js --name node-app

pm2 save

echo "🎉 Deployment completed successfully!"
EOF
                    """
                }
            }
        }
    }

    post {
        failure {
            echo "❌ Deployment failed! Check remote server logs."
        }
    }
}
