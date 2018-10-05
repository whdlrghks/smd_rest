# -*- coding: utf-8 -*-
"""
Created on Sat Aug 18 14:33:13 2018

@author: tjsal
"""

from bs4 import BeautifulSoup
import re
from selenium import webdriver
import sys

driver = webdriver.Chrome('/Users/ikhwan/capstone/chromedriver')



#신세계
def getPercent_ssg(url):    # 해당 상품의 신세면세점 적립금 적용 한계 퍼센트를 가져옴, ssg_percent 값이 퍼센트값
    driver.get(url)
    try:
        html = driver.page_source
        soup = BeautifulSoup(html, 'html.parser')
        driver.quit()
        ssg_brand_percent = soup.find("div",{"class" : "saveMoneyInfo"}).text
        if '적립금 사용이 불가' in ssg_brand_percent:
            ssg_percent = 0
        else:
            ssg_percent = int(soup.find("div",{"class" : "saveMoneyInfo"}).find("span").text.replace("%",""))
    except:
        ssg_percent = 0
        driver.quit()
    print(ssg_percent)

getPercent_ssg(sys.argv[1])
