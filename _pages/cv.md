---
layout: archive
title: "CV"
permalink: /cv/
author_profile: true
redirect_from:
  - /resume
---

{% include base_path %}

Education
======
* Bachelor of Science in Mechanical Design and Manufacture and Automation, Chongqing University, 2020
* Bachelor of Science in Mechanical Engineering (Cum Laude), University of Cincinnati, 2020
* Master of Science in Mechanical Engineering - Research Program, Carneigie Mellon University, expected 2022

Work Experience
======
* Fall 2021: Teaching Assistant 
  * 24787 Machine Learning and Artificial Intelligence for Engineers 
  * Carnegie Mellon University 
  * Duties included: 
    * Held a weekly recitation showing how to cluster the data with different unsupervised algorithms such as K-means,
Spectral, DBscan, Mean shift and helped students plot decision boundary
    * Designing Assignment like using 
  * Supervisor: Professor Amir Barati Farimani


Research Experience 
======
* Summer 2021: Research Assistant
  * Carnegie Mellon University
  * Supervisor: Professor Amir Barati Farimani
  * Research included: 
    * Humanoid Robot Locomotion Control 
    * Modified the humanoid robot URDF file to identify the joints’ index and motion type
    * Parsed the original Motion Capture (Mocap) data from the CMU database and stored joints
    * Created a human skeleton using MuJoCo robot and visualized the motion trajectory in PyBullet
    * Applied motion retargeting to Mocap data and controlled humanoid robot using null-space inverse kinematics
    * Designed a reward function that calculated the difference between humanoid joints’ position and velocity
    * Implemented PPO (proximal policy optimization) algorithm as the training agent that enabled a humanoid robot to learn from the Mocap data’s demonstration
    * Visualized the trained model alongside with motion retargeted model

Skills
======
* Robot Operating System (ROS)
* Programing Language
  * Sub-skill 2.1
  * Sub-skill 2.2
  * Sub-skill 2.3
* Skill 3

Publications
======
  <ul>{% for post in site.publications %}
    {% include archive-single-cv.html %}
  {% endfor %}</ul>
  
Talks
======
  <ul>{% for post in site.talks %}
    {% include archive-single-talk-cv.html %}
  {% endfor %}</ul>
  
Teaching
======
  <ul>{% for post in site.teaching %}
    {% include archive-single-cv.html %}
  {% endfor %}</ul>
  
Service and leadership
======
* Currently signed in to 43 different slack teams
