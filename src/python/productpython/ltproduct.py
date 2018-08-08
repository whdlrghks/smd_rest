from time import sleep
from bs4 import BeautifulSoup
import re
from selenium import webdriver
import sys
import requests



def lotte_2(url):   # url = 상품 페이지 url
    lt_product = url
    # try:
    req = requests.get(lt_product)
         # HTML 소스 가져오기
    html = req.text
    soup = BeautifulSoup(html, 'html.parser')
    lt_price = soup.find("meta",{"property" : "rb:originalPrice"})
    lt_product_normal_price = lt_price.get('content').replace(".00","")   #상품 가격 (정가)
    if '일시품절 상품 입니다' in html:   #일시품점일 경우 neg, 재고가 남아 있을 경우 pos
        lt_product_ps = 'neg'
    else:
        lt_product_ps = 'pos'
    print(lt_product_normal_price+"/"+lt_product_ps)
    # except:
    #     print("No price/No storage")


lotte_2(sys.argv[1])
