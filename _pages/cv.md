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
* 9/2020 - Present: Research Assistant
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
* 12/2019 - 5/2020: Research Assistant 
  * University of Cincinnati 
  * Supervisor: Professor Janet Jiaxiang Dong 
  * Research included:
    * Designed a feasible structure that could help military soldiers to lift 100 pounds weight of bombs using SolidWorks and analyze the structural integrity using Ansys
    * Integrated EMG sensors to detect biceps strength and recorded the real-time voltage when moving the arms
    * Actuated the motor using PWM based on the data from the EMG sensor
    * Performed 3D-printing to make non-standard components and learned how to troubleshoot 3D printer
    * Applied Motion Studies to the exoskeleton model and conducted motion simulation using SolidWorks
    * Built a prototype in a workshop and tested the performance
* 20/2018 - 8/2019: Research Assistant
  * Chongqing University 
  * Supervisor: Professor Tao Huang 
  * Research included:
   * Wrote LabVIEW code for real-time collection of MPU9250 data (accelerometer, gyroscope, magnetometer, thermometer, etc.) with NI myRIO (Student Embedded Device)
   * Achieved the control of brushless motors by using ESC (Electronic Speed Controller) and then the flight control of UAV by the output PWM signals from LabVIEW
   * Applied Kalman filter and smoothing filter to the IMU data using C++ and calculate the real-time principal axis of UAV using quaternion
   * Acquired dataset through real-time data collection and trained neural network model using SGD (stochastic gradient descent), MBGD (Mini-Batch Gradient Descent), and Adam (Adaptive Moment Estimation)
   * Built physical UAV flying platform and completed real-time fault diagnosis in LabVIEW panel

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



