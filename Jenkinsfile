#!/usr/bin/env groovy
// Jenkinsfile - Jenkins configuration for VMS's frontend
// Volunteer Management Team <vms@scholastic.com>
// (c) Scholastic Corporation 2016

// Things that need to be configured:
//    - GlusterFS Mount:   /opt/vms_dev/app_vms pointing to dev
//    - GlusterFS Mount:   /opt/vms_qa/app_vms  pointing to qa
//    - The user who runs the script should have sudo no password access

node {
    def scan_branches = ["master"]
    def deploy_branches = ["master"]

    stage('checkout') {
        checkout scm
    }

    stage('configure') {
        properties([buildDiscarder(logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '5', numToKeepStr: '')), parameters([booleanParam(defaultValue: false, description: '', name: 'VMSINCLUDE'), booleanParam(defaultValue: false, description: '', name: 'VMSUAT'), booleanParam(defaultValue: false, description: '', name: 'VMSQA')]), pipelineTriggers([])])
    }

    stage('npm dependencies') {
        sh 'npm install'
    }

    stage('build and lint') {
        sh 'grunt --no-color prod'
    }

    stage('unit tests') {
        sh 'grunt --no-color karma:jenkins'
    }

    stage('SonarQube') {
        if(scan_branches.contains(env.BRANCH_NAME)) {
            try {
              sh 'grunt --no-color sonarRunner:analysis'
            } catch (error) {
                echo 'sonar failed, just skip it'
            }
        }
    }

    stage('publish tests') {
        junit 'test-results.xml'
        step([$class: 'CoberturaPublisher', autoUpdateHealth: false, autoUpdateStability: false, coberturaReportFile: '**/Phantom*/cobertura-coverage.xml', failUnhealthy: false, failUnstable: false, maxNumberOfBuilds: 0, onlyStable: false, sourceEncoding: 'ASCII', zoomCoverageChart: false])
    }

    stage('deploy') {
        if(env.VMSQA == "true") {
            // Deploy to QA (manual only) and with no include files
           if(env.VMSINCLUDE == 'false') {
                // Delete include files if we're not supposed to deploy them
                sh 'sudo rm -frv dist/include/'
            }
            sh 'sudo cp -frv dist/* /opt/vms_qa/app_vms/'
        } else if (env.VMSUAT == "true") {
            // Deploy to UAT (manual only) and with no include files
           if(env.VMSINCLUDE == 'false') {
                // Delete include files if we're not supposed to deploy them
                sh 'sudo rm -frv dist/include/'
            }
            sh 'sudo cp -frv dist/* /opt/vms_uat/app_vms/'
        } else if(deploy_branches.contains(env.BRANCH_NAME)) {
            // Deploy to dev/local docker instance (automatically)
            sh 'sudo cp -frv dist/* /opt/vms_dev/app_vms/'
            try {
                sh 'docker stop $(docker ps | grep bookfairs/vms-gui:master | awk \'{print $1;}\')'
                //sh 'docker stop vms/gui:master'
            } catch (error) {
               echo 'cannot stop because it was never started'
            }
            sh 'docker build -t bookfairs/vms-gui:master .'
            sh 'docker run -d -p 5555:80 bookfairs/vms-gui:master'
        }
    }
}
