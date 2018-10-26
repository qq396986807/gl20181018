#!/bin/bash
LOCAL_DIR=$(cd "$(dirname "$0")";pwd)
DEPLOY_DIR="/usr/share/nginx/html/wcampaign/gl20181018/h5/"


npm run build && npm run export

wait
tar cvf out.tar out


# put file to server
sftp stw_eur_ecs_1 <<EOF
cd /tmp
lcd "${LOCAL_DIR}"
put out.tar
exit
EOF

yes|rm "${LOCAL_DIR}/out.tar"

echo "successfully to upload file!"

echo "start deploy on server!"
ssh stw_eur_ecs_1 << remotessh 
cd ${DEPLOY_DIR}
yes|rm out.tar
mv /tmp/out.tar .
rm -rf out
tar xvf out.tar
exit
remotessh

echo "successfully to deploy!"
