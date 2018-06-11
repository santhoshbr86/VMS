# Dockerfile - Deploy static VMS assets.
# Volunteer Management Team <vms@scholastic.com>
# (c) Scholastic Corporation 2016
#
# Build with: `grunt dev && docker build -t vms/gui:master .`
# Run   with: `docker run -d -p 8000:8000 vms/gui:master`

FROM nginx:mainline-alpine
COPY dist/ /usr/share/nginx/html
