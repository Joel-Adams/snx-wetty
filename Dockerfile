# Base RHEL 7 with wetty
# Includes epel repo for local build

FROM rhel:latest

MAINTAINER Joel Adams <jadams111686 4t gmail.com>

# You can edit the repo file and uncomment the lines below
# in order to use a local CentOS-Base mirror (if you have one).
# This is HIGHLY recommended if you plan to build
# images locally.

# ADD CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo

# Disabling the fastest mirror plugin is also a good
# idea if you have a local mirror.

# RUN sed -i 's/enabled=1/enabled=0/' /etc/yum/pluginconf.d/fastestmirror.conf

ADD . /app
WORKDIR /app

RUN yum -y install deltarpm && \
    yum update -y && \
    yum install net-tools tar wget unzip -y && \
    yum -y install https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm && \
    yum repolist && \
    yum install pwgen nodejs npm vim shadow-utils tmux -y && \
    yum groups mark convert && \
    yum -y groupinstall 'Development Tools' && \
    npm install && \
    cd /tmp && \
    wget https://github.com/openshift/origin/releases/download/v3.10.0/openshift-origin-client-tools-v3.10.0-dd10d17-linux-64bit.tar.gz && \
    tar xzvf openshift-origin-client-tools-*.tar.gz && \
    cd openshift-origin-client-tools-* && \
    mv oc /usr/local/bin/ && \
    cd /tmp && \
    rm -rf openshift-origin-client-tools-* && \
    yum -y groupremove 'Development Tools' && \
    yum -y install git && \
    yum clean all && \
    rm -rf /var/cache/yum
RUN ./userloop.sh

EXPOSE 3000

ENTRYPOINT ["node"]
CMD ["app.js", "-p", "3000"]
