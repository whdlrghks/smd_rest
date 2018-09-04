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


def remove_html_tags(data):
    p = re.compile(r'<.*?>')
    return p.sub('\n', data)


def lotte_2(url):   # url = 상품 페이지 url
    driver = webdriver.Chrome('/Users/ikhwan/capstone/chromedriver')
    lt_product = url
    driver.get(lt_product)
    html = driver.page_source
    driver.quit()

    try:
        soup = BeautifulSoup(html, 'html.parser')

        try:
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
            lt_price = lt_product_normal_price = soup.select("#prdPriceBenefit > div.infoData.price > dl.member > dd > div.priceArea > strong")
            lt_product_sale_price = remove_html_tags(str(lt_price[0])).replace("\n","").replace("$","")
            lt_price2 = soup.find("meta",{"property" : "rb:originalPrice"})
            lt_product_normal_price = lt_price2.get('content')
        except:
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
            lt_price = soup.find("meta",{"property" : "rb:originalPrice"})
            lt_product_normal_price = lt_price.get('content')
            lt_product_sale_price = '로그인 필요'
            
        if '일시품절 상품 입니다' in html:   #일시품점일 경우 neg, 재고가 남아 있을 경우 pos
            lt_product_ps = 'neg'
        else:
            lt_product_ps = 'pos'
        if ".00" in lt_product_normal_price:
            lt_product_normal_price=lt_product_normal_price.replace(".00","")

        print(lt_product_normal_price+"/"+lt_product_sale_price+"/"+lt_product_ps+"/"+str(lt_percent))
    except:
        print("No price/No price/No storage/No percent")


lotte_2(sys.argv[1])
