#!/bin/bash
LOCAL_DIR=$(cd "$(dirname "$0")";pwd)
DEPLOY_DIR="/mnt/nginx/html/example/guerlain/guerlain20181011/h5/gl20181018/"


npm run build && npm run export

wait
tar cvf out.tar out


# put file to server
sftp createc_ecs_2 <<EOF
cd /tmp
lcd "${LOCAL_DIR}"
put out.tar
exit
EOF

yes|rm "${LOCAL_DIR}/out.tar"

echo "successfully to upload file!"

echo "start deploy on server!"
ssh createc_ecs_2 << remotessh 
cd ${DEPLOY_DIR}
yes|rm out.tar
mv /tmp/out.tar .
rm -rf out
tar xvf out.tar
exit
remotessh

echo "successfully to deploy!"
