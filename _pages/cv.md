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

Research Experience 
======
* Summer 2020 - Present: Research Assistant
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
    * An energy-saving Snake Locomotion Gait Design Obtained using PPO
      * Implemented PPO and TRPO (trust region policy optimization) as an agent to learn snake robot locomotion gait
      * Built snake robot model using PyBullet physics simulation engine by concatenating joints sequentially
      * Controlled the snake robot using sinusoidal equation-based controlling policy with fixed phase shift for multiple joints
      * Integrated snake robot model into OpenAI Gym environment for applying PPO and TRPO algorithms
      * Customized architectures for both value and policy function approximators
      * Designed a reward function with an expected return of 100 based on both the current observations and constraints of the snake robot
      * Achieved 15% energy efficiency improvement using PPO and 10% speed increase in the simulation
      
Professional Experience
======
* Fall 2021: Teaching Assistant 
  * 24787 Machine Learning and Artificial Intelligence for Engineers 
  * Carnegie Mellon University 
  * Supervisor: Professor Amir Barati Farimani
  * Duties included: 
    * Held a weekly recitation showing how to cluster the data with different unsupervised algorithms such as K-means,Spectral, DBscan, Mean shift and helped students plot decision boundary
    * Designed a weekly assignment about applying GMM (Gaussian Mixture Model) with EM (Expectation-Maximization) algorithm on a 1D dataset. Also, created one question related to write a k-means algorithm in Python from scratch and compared the results with sklearn k-means
    * Held weekly office hours to show matrix multiplication of MLP forward and back propagation with different activation functions (Sigmoid, ReLU, and Tanh). Also, implemented OVA (One-vs-All) logistic regression from scratch for ten classes handwritten digits and verified the trained model by predicting against sklearn trained model



