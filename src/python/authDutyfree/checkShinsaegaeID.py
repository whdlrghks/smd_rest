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
#https://www.ssgdfm.com/shop/main success
#https://www.ssgdfm.com/shop/login/loginPopup Fail
# import os
#http://www.shilladfs.com/estore/kr/ko/?uiel=Desktop success
#https://www.shilladfs.com/estore/kr/ko/login?error=true&popup=true&nextUrl=/estore/kr/ko fail
def reserved(driver):
    title3 = WebDriverWait(driver, 100) \
        .until(EC.presence_of_element_located((By.CSS_SELECTOR, "#ssgdf-header > div.headWrap > div > div.markList > ul > li:nth-child(2) > a")))
    driver.find_element_by_xpath('//*[@id="ssgdf-header"]/div[2]/div/div[2]/ul/li[2]/a').click()
    title2 = WebDriverWait(driver, 100) \
        .until(EC.presence_of_element_located((By.CSS_SELECTOR, "#Form1 > div > div > div.memberInfobox > div.onlineInfoBox > div.myWalletBox")))
    driver.find_element_by_xpath('//*[@id="Form1"]/div/div/div[1]/div[1]/div[2]/ul/li[2]/a').click()

    title = WebDriverWait(driver, 100) \
        .until(EC.presence_of_element_located((By.CSS_SELECTOR, "#Form1 > div.savemoney-box.reserve-fund > div > ul > li:nth-child(1) > p.dataTxt > span")))
    html = driver.page_source
    soup = BeautifulSoup(html,'html.parser')
    driver.quit()
    #총 적립금만 가져오기
    req1 = soup.find("span",{"class" : "total-save"})

    price1 = remove_html_tags(str(req1))
    price1 = "".join(price1.split());
    price1 = price1.replace("원","");
    price1 = price1.replace(",","")
    reserved_1 = int(price1) / 1100
    reserved_final = str(round(reserved_1,2))
    print("ssg success/"+reserved_final)

def checkID():
# <<<<<<< HEAD
    dir_path = os.path.dirname(os.path.realpath(os.getcwd()))
    driver = webdriver.Chrome('/home/cloudpool/Desktop/Capstone/chromedriver'))
# =======
#     # options = webdriver.ChromeOptions()
#     # options.add_argument('headless')
#     # options.add_argument('window-size=1920x1080')
#     # options.add_argument("--disable-gpu")
#     # # 혹은 options.add_argument("--disable-gpu")
#     #
#     # driver = webdriver.Chrome('/Users/ikhwan/capstone/chromedriver', chrome_options=options)
#     driver = webdriver.Chrome('/Users/ikhwan/capstone/chromedriver')
# >>>>>>> d52e0ffd2ce47e1e55cdbc6dec1beba44997717e
    driver.get('https://www.ssgdfm.com/shop/main')
    driver.switch_to_window(driver.window_handles[0])
    title4 = WebDriverWait(driver, 100) \
        .until(EC.presence_of_element_located((By.CSS_SELECTOR, "#ssgdf-header > div.headWrap > div > div.markList > ul > li:nth-child(1) > a")))
    # //*[@id="ssgdf-header"]/div[2]/div/div[2]/ul/li[1]/a
    driver.find_element_by_xpath('//*[@id="ssgdf-header"]/div[2]/div/div[2]/ul/li[1]/a').click()
    # driver.implicitly_wait(5)
    window_before = driver.window_handles[0]
    window_after = driver.window_handles[1]
    driver.implicitly_wait(10)
    driver.switch_to_window(window_after)
    driver.find_element_by_name('userId').send_keys(sys.argv[1])
    driver.find_element_by_name('password').send_keys(sys.argv[2])
    driver.find_element_by_xpath('//*[@id="loginForm"]/div/div[2]/input').click()
    driver.implicitly_wait(3)


    try:
        driver.switch_to_window(window_after)
        result = driver.current_url
    except :
        driver.switch_to_window(window_before)
        result = driver.current_url

    if result =='https://www.ssgdfm.com/shop/main' :
        reserved(driver)
        # print('ssg success')

    if result =='http://www.ssgdfm.com/common/redirectURL?encURL=https://www.ssgdfm.com/shop/main' :
        reserved(driver)
        # print('ssg success')
    elif result =='http://www.ssgdfm.com/shop/mypage/main' :
        reserved(driver)
        # print('ssg success')
    elif result =='https://www.ssgdfm.com/shop/login/loginPopup' :
        driver.quit()
        print('ssg fail/')
    # else :
    #     print('ssg fail')




checkID()
