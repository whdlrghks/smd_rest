#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Fri Jun  8 15:00:51 2018

@author: ikhwan
"""

from selenium import webdriver
from bs4 import BeautifulSoup
import re
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.by import By
import os
import sys

def remove_html_tags(data):
    p = re.compile(r'<.*?>')
    return p.sub('\n', data)

def getresevered(driver):
    driver.get("https://kor.lps.lottedfs.com/kr/mypage/svmnHstrList")

    timeout = 5
    try:
        element_present = EC.presence_of_element_located((By.ID, 'mylotteMemberInfoArea'))
        WebDriverWait(driver, timeout).until(element_present)
    except TimeoutException:
        print ('lotte fail')
        #WebDriverWait wait = new WebDriverWait(WebDriverRefrence,5);
        #wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("mylotteMemberInfoArea")));

    html = driver.page_source
    soup = BeautifulSoup(html,'html.parser')
    driver.quit()
    #일반 적립금
    req1 = soup.find("a",{"id" : "selectSvmn_01"}).find("strong")
    price1 = remove_html_tags(str(req1))
    price1 = "".join(price1.split());
    price1 = price1.replace(",","");

    #플러스 적립금
    req2 = soup.find("a",{"id" : "selectSvmn_02"}).find("strong")
    price2 = remove_html_tags(str(req2))
    price2 = "".join(price2.split());

    # #PC전용 적립금 - 현재 사라짐
    # req3 = soup.find("a",{"id" : "selectSvmn_03"}).find("strong")
    # price3 = remove_html_tags(str(req3))
    # price3 = "".join(price3.split());

    #모바일 전용 적립금
    req4 = soup.find("a",{"id" : "selectSvmn_04"}).find("strong")
    price4 = remove_html_tags(str(req4))
    price4 = "".join(price4.split());

    allprice = int(price1) + int(price2) + int(price4);
    print('lotte success/'+str(allprice))

#https://kor.lps.lottedfs.com/kr/mypage/svmnHstrList success
#https://kor.lps.lottedfs.com/kr/member/ssoSuccess success
#https://kor.lps.lottedfs.com/kr/member/ssoFail Fail

def compare(result,driver):
    if result =='https://kor.lps.lottedfs.com/kr/mypage/svmnHstrList':
        getresevered(driver)
        # print('lotte success')

    elif result =='https://kor.lps.lottedfs.com/kr/member/ssoSuccess':
        # print('lotte success')
        getresevered(driver)
    elif result =='http://lpsso.lottedfs.com/app/login/LSLA100300.do':
        # print('lotte success')
        getresevered(driver)
    elif result =='https://kor.lps.lottedfs.com/kr/member/!pointlogin':
        # print('lotte success')
        getresevered(driver)

    elif result =='https://kor.lps.lottedfs.com/kr/member/ssoFail':
        driver.quit()
        print('lotte fail')


def checkLotteID():

#https://kor.lps.lottedfs.com/kr/member/ssoSuccess
#http://lpsso.lottedfs.com/app/login/LSLA100300.do
#https://kor.lps.lottedfs.com/kr/member/!pologin
# <<<<<<< HEAD
#     dir_path = os.path.dirname(os.path.realpath(os.getcwd()))
#
# =======
    # dir_path = os.path.dirname(os.path.realpath(os.getcwd()))
    # driver = webdriver.Chrome('/Users/ikhwan/capstone/chromedriver')
    options = webdriver.ChromeOptions()
    options.add_argument('headless')
    options.add_argument('window-size=1920x1080')
    options.add_argument("--disable-gpu")
    # 혹은 options.add_argument("--disable-gpu")

    driver = webdriver.Chrome('/home/cloudpool/Desktop/Capstone/chromedriver')
# >>>>>>> d52e0ffd2ce47e1e55cdbc6dec1beba44997717e

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
        print ('lotte fail/')
    #WebDriverWait wait = new WebDriverWait(WebDriverRefrence,5);
    #wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("mylotteMemberInfoArea")));
    result = driver.current_url
    compare(result, driver)
    #while result!='https://kor.lps.lottedfs.com/kr/member/login' :
    #    driver.implicitly_wait(1)
    #    result = driver.current_url



    #else :
    #    print('lotte fail')

checkLotteID()
