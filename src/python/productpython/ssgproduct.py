# -*- coding: utf-8 -*-
"""
Spyder Editor

This is a temporary script file.
"""
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






def ssg_sele(url):
    driver = webdriver.Chrome('/Users/ikhwan/capstone/chromedriver')
    #driver = new HtmlUnitDriver();
    #new WebDriverWait(driver, 10).until(ExpectedConditions.presenceOfElementLocated(By.id(“element”)));
    driver.get(url)

    sleep(3)
    try:
        html = driver.page_source
        soup = BeautifulSoup(html, 'html.parser')
        ssg_price1 = soup.find("span",{"id" : "totalAmtDal"}).text.strip().replace("$","")
            # if ".00" in ssg_price1:
            #     ssg_price = ssg_price1.replace(".00","")
            # else:
            #     ssg_price = ssg_price1
        driver.quit()
        #script_price = soup.find_all('script')
        #script = script_price[78]
        #splitdata = script.text.strip().split("jQuery")[0]
        #ssg_storage = splitdata.split("var")[11].split("\"")[1]
        if '일시품절' in html:   #일시품점일 경우 neg, 재고가 남아 있을 경우 pos
            ssg_product_ps = 'neg'
        else:
            ssg_product_ps = 'pos'
        print(ssg_price1+"/"+ssg_product_ps)



    except UnexpectedAlertPresentException:

        Alert(driver).dismiss()
        print("No price/"+"neg")

    # except:
    #     print("No price/No storage")


ssg_sele(sys.argv[1])
