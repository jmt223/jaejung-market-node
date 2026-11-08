#!/bin/bash
# 재중마켓 Node 버전 Rocky 서버(192.168.100.20)에 설치하는 스크립트
# deploy-rocky.bat 이 /tmp 에 node-backend.tgz, node-frontend.tgz, sample*.png 올려놓고 sudo 로 이걸 실행함
# 처음 실행할때 계정, 서비스, 방화벽까지 다 만들고 두번째부터는 파일만 바꾸고 재시작함
set -e

APP=/opt/jmt223-node

# 1. 서비스 돌릴 계정 (로그인은 못하는 계정). root로 돌리면 뚫렸을때 서버 전체가 털림
if ! id jmt223node > /dev/null 2>&1; then
  useradd --system --home-dir $APP --no-create-home --shell /sbin/nologin jmt223node
  echo "jmt223node 계정 만듬"
fi

# 2. 폴더 만들기
mkdir -p $APP/backend $APP/frontend $APP/uploads

# 3. 서비스 멈추고 예전 파일 지운 다음 새로 풀기 (처음엔 서비스가 없어서 에러나도 무시)
systemctl stop jmt223-node-frontend jmt223-node-backend 2> /dev/null || true
rm -rf $APP/backend/* $APP/backend/.env $APP/frontend/* $APP/frontend/.next $APP/frontend/.env.local
tar -xzf /tmp/node-backend.tgz -C $APP/backend
tar -xzf /tmp/node-frontend.tgz -C $APP/frontend

# 4. 상품 샘플 이미지 (웹 루트 밖 업로드 폴더)
cp -f /tmp/sample*.png $APP/uploads/

# 5. 라이브러리 설치 (개발용은 빼고)
# npm ci 는 내 PC(npm 11)에서 만든 lock 파일이랑 서버 npm(10) 이 안맞아서 에러남. install 로 함
cd $APP/backend && npm install --omit=dev --no-audit --no-fund
cd $APP/frontend && npm install --omit=dev --no-audit --no-fund

# 6. 권한
# 코드는 root 꺼라서 서비스 계정은 읽기만 됨. .env 는 비번이 있어서 다른 사람은 못읽게 함
chown -R root:jmt223node $APP/backend $APP/frontend
chmod -R o-rwx $APP/backend $APP/frontend
chmod 640 $APP/backend/.env $APP/frontend/.env.local
# Next 가 실행중에 캐시 파일 쓰는 폴더랑 이미지 업로드 폴더만 서비스 계정이 쓸수 있음
mkdir -p $APP/frontend/.next/cache
chown -R jmt223node:jmt223node $APP/frontend/.next/cache $APP/uploads
chmod 750 $APP/uploads
chmod 640 $APP/uploads/*

# 7. systemd 서비스 (서버 재부팅해도 자동으로 뜸)
cat > /etc/systemd/system/jmt223-node-backend.service << 'EOF'
[Unit]
Description=jmt223 Node backend (NestJS, 127.0.0.1:4000)
After=network.target

[Service]
User=jmt223node
Group=jmt223node
WorkingDirectory=/opt/jmt223-node/backend
Environment=NODE_ENV=production
ExecStart=/usr/bin/node dist/main.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF

cat > /etc/systemd/system/jmt223-node-frontend.service << 'EOF'
[Unit]
Description=jmt223 Node frontend (Next.js, 0.0.0.0:3000)
After=network.target jmt223-node-backend.service

[Service]
User=jmt223node
Group=jmt223node
WorkingDirectory=/opt/jmt223-node/frontend
Environment=NODE_ENV=production
ExecStart=/usr/bin/node server.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable jmt223-node-backend jmt223-node-frontend > /dev/null 2>&1
systemctl restart jmt223-node-backend
systemctl restart jmt223-node-frontend

# 8. 방화벽. 3000(프론트)만 열고 4000(백엔드)은 안 엶
if ! firewall-cmd --list-ports | grep -q "3000/tcp"; then
  firewall-cmd --permanent --add-port=3000/tcp > /dev/null
  firewall-cmd --reload > /dev/null
  echo "방화벽 3000/tcp 열음"
fi

# 9. 올린 파일 정리
rm -f /tmp/node-backend.tgz /tmp/node-frontend.tgz /tmp/sample*.png

echo "설치 끝"
