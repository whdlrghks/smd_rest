# -*- coding: utf-8 -*-
"""
Created on Sat Aug 18 14:33:13 2018

@author: tjsal
"""
from bs4 import BeautifulSoup
import re
from selenium import webdriver
import sys

driver = webdriver.Chrome('/home/cloudpool/Desktop/Capstone/chromedriver')

#신라
def getPercent_shilla(url):    # 해당 상품의 신라면세점 적립금 적용 한계 퍼센트를 가져옴, sl_percent 값이 퍼센트값
    driver.get(url)
    html = driver.page_source
    soup = BeautifulSoup(html, 'html.parser')
    driver.quit()
    sl = soup.find("div",{"class" : "save_info_box"}).text
    if '적립금을 사용할 수 없습니다.' in sl:
        sl_percent = 0
    else:
        sl_tmp = soup.find("div",{"class" : "save_info_box"}).find("strong")
        sl2 = remove_html_tags(str(sl_tmp)).replace('\n','').replace('%','')
        sl_percent = int(sl2)
    print(sl_percent)

getPercent_shilla(sys.argv[1])
