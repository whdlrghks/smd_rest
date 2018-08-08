from time import sleep
from bs4 import BeautifulSoup
import re
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.common.exceptions import UnexpectedAlertPresentException
from selenium.webdriver.common.alert import Alert
import sys
import requests




def lotte_2(url):   # url = 상품 페이지 url
    driver = webdriver.Chrome('/Users/ikhwan/capstone/chromedriver')
    lt_product = url
    # try:
    driver.get(lt_product)
    html = driver.page_source
    soup = BeautifulSoup(html, 'html.parser')
    try:
        lt_price = lt_product_normal_price = soup.select("#prdPriceBenefit > div.infoData.price > dl.member > dd > div.priceArea > strong")
        lt_product_normal_price = remove_html_tags(str(lt_price[0])).replace("\n","").replace("$","")
    except:
        lt_price = soup.find("meta",{"property" : "rb:originalPrice"})
        lt_product_normal_price = lt_price.get('content')
    if '일시품절 상품 입니다' in html:   #일시품점일 경우 neg, 재고가 남아 있을 경우 pos
        lt_product_ps = 'neg'
    else:
        lt_product_ps = 'pos'
    driver.quit()
    lt_product_normal_price=lt_product_normal_price.replace(".00","")
    print(lt_product_normal_price+"/"+lt_product_ps)
    # except:
    #     print("No price/No storage")


lotte_2(sys.argv[1])
