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


#롯데
def getPercent_lotte(url):    # 해당 상품의 롯데면세점 적립금 적용 한계 퍼센트를 가져옴, lt_percent 값이 퍼센트값
    driver.get(url)
    html = driver.page_source
    soup = BeautifulSoup(html, 'html.parser')
    driver.quit()
    if '적립금 사용불가' in html:
        lt_percent = 0
    else:
        cnt = soup.find("ul",{"id":"svmnBrndPrd"})
        cnt_tmp = str(cnt.get('style'))
        if 'display:none;' in cnt_tmp:
            pct_tmp = remove_html_tags(str(soup.find("p",{"id":"svmnGen"}))).split("최대 ")
            pct_tmp2 = pct_tmp[1].split("%")
            lt_percent = int(pct_tmp2[0])
        else:
            pct_tmp = remove_html_tags(str(cnt.find("li"))).split("최대 ")
            pct_tmp2 = pct_tmp[1].split("%")
            lt_percent = int(pct_tmp2[0])
    print(lt_percent)

getPercent_lotte(sys.argv[1])
