#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Fri Jun  8 15:00:51 2018

@author: ikhwan
"""
from selenium import webdriver
from bs4 import BeautifulSoup
import sys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.by import By
import os


#https://kor.lps.lottedfs.com/kr/mypage/svmnHstrList success
#https://kor.lps.lottedfs.com/kr/member/ssoSuccess success
#https://kor.lps.lottedfs.com/kr/member/ssoFail Fail

def compare(result):
    if result =='https://kor.lps.lottedfs.com/kr/mypage/svmnHstrList':
        print('lotte success')

    elif result =='https://kor.lps.lottedfs.com/kr/member/ssoSuccess':
        print('lotte success')
    elif result =='http://lpsso.lottedfs.com/app/login/LSLA100300.do':
        print('lotte success')
    elif result =='https://kor.lps.lottedfs.com/kr/member/!pointlogin':
        print('lotte success')

    elif result =='https://kor.lps.lottedfs.com/kr/member/ssoFail':
        print('lotte fail')


def checkLotteID():

#https://kor.lps.lottedfs.com/kr/member/ssoSuccess
#http://lpsso.lottedfs.com/app/login/LSLA100300.do
#https://kor.lps.lottedfs.com/kr/member/!pologin
    dir_path = os.path.dirname(os.path.realpath(os.getcwd()))
    driver = webdriver.Chrome('/home/cloudpool/Desktop/Capstone/chromedriver')

    driver.get("https://kor.lps.lottedfs.com/kr/mypage/svmnHstrList")
    driver.find_element_by_name('loginLpId').send_keys(sys.argv[1])
    driver.find_element_by_name('password').send_keys(sys.argv[2])
    driver.find_element_by_xpath('/html/body/div/div/section/div/div/div[1]/form/div[2]/div/div[1]/p[2]/a').click()
    driver.implicitly_wait(3)

    timeout = 5
    try:
        element_present = EC.presence_of_element_located((By.ID, 'mylotteMemberInfoArea'))
        WebDriverWait(driver, timeout).until(element_present)
    except TimeoutException:
        print ('lotte fail')
    #WebDriverWait wait = new WebDriverWait(WebDriverRefrence,5);
    #wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("mylotteMemberInfoArea")));
    result = driver.current_url
    compare(result)
    #while result!='https://kor.lps.lottedfs.com/kr/member/login' :
    #    driver.implicitly_wait(1)
    #    result = driver.current_url



    #else :
    #    print('lotte fail')

checkLotteID()
