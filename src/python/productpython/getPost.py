# -*- coding: utf-8 -*-
"""
Created on Wed Aug  8 17:16:34 2018

@author: tjsal
"""
from bs4 import BeautifulSoup
import re
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By

import sys

def remove_html_tags(data):
    p = re.compile(r'<.*?>')
    return p.sub('\n', data)



def getPost(product_title):

    postList=""

#     driver = webdriver.Chrome('/home/cloudpool/Desktop/Capstone/chromedriver')

    options = webdriver.ChromeOptions()
    options.add_argument('headless')
    options.add_argument('window-size=1920x1080')
    options.add_argument("--disable-gpu")
    # 혹은 options.add_argument("--disable-gpu")

    driver = webdriver.Chrome('/Users/ikhwan/capstone/chromedriver', chrome_options=options)

    for i in range (0,3):
        prd1 = 'https://search.naver.com/search.naver?sm=tab_hty.top&where=post&query='
        prd2 = product_title.replace(" ","+")
        url = prd1+prd2
        driver.get(url)
        html = driver.page_source
        soup = BeautifulSoup(html, 'html.parser')
        try:
            try:
                image_tmp1 = soup.select('#sp_blog_'+str(i+1)+' > div > a.sp_thmb.thmb80 > img')
                image_tmp2 = str(image_tmp1[0]).split('src="')
                image_tmp3 = image_tmp2[1].split('"')
            except:
                image_tmp3[0]='/images/no_img.png'
            post_image = image_tmp3[0]
            # link_tmp1 = soup.find("li",{"id":"sp_blog_"+str(i+1)}).findAll("a")
            link_tmp1 = soup.findAll("a",{"class":"sh_blog_title _sp_each_url _sp_each_title"})
            post_link = link_tmp1[i].get('href')

            title =link_tmp1[i].get('title')
            post_title = title
            mess_tmp1 = soup.select("#sp_blog_"+str(i+1)+" > dl > dd.sh_blog_passage")
            # post_message = remove_html_tags(str(mess_tmp1[0])).replace("amp;","").replace("\n","").replace("\'","")
            post_message = remove_html_tags(str(mess_tmp1[0])).replace("amp;","").replace("\n","")
        except:
            post_image = '/images/no_img.png' # no_img.png 파일 경로
            post_title = "검색 결과 없음"
            post_message = "검색 결과 없음"
            post_link = " "



        # print("이미지 주소 : "+post_image)
        # print("포스트 제목 : " + post_title)
        # print("포스트 요약 : "+post_message)
        # print("포스트 링크 : " + post_link)
        # postList.append(""+post_image+""+post_title+""+post_message post_link])
        postList=postList+"<IK@SMD>"+post_image+"<IK@SMD>"+post_title+"<IK@SMD>"+post_message+"<IK@SMD>"+post_link
    driver.quit()
    print(postList)

getPost(sys.argv[1]) # 상품명 입력하면, 해당 상품과 관련 된 네이버 블로그 상단 3개 포스트의 링크, 사진, 타이틀, 간략설명 가져옴
