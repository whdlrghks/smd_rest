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
    driver = webdriver.Chrome('/home/cloudpool/Desktop/Capstone/chromedriver')
    #driver = new HtmlUnitDriver();
    #new WebDriverWait(driver, 10).until(ExpectedConditions.presenceOfElementLocated(By.id(“element”)));
    driver.get(url)
    html = driver.page_source
    driver.quit()
    try:
        soup = BeautifulSoup(html, 'html.parser')
            # if ".00" in ssg_price1:
            #     ssg_price = ssg_price1.replace(".00","")
            # else:
            #     ssg_price = ssg_price1

        #script_price = soup.find_all('script')
        #script = script_price[78]
        #splitdata = script.text.strip().split("jQuery")[0]
        #ssg_storage = splitdata.split("var")[11].split("\"")[1]

        if '일시품절' in html:   #일시품점일 경우 neg, 재고가 남아 있을 경우 pos
            ssg_product_ps = 'neg'
        else:
            ssg_product_ps = 'pos'

        try:
            ssg_brand_percent = soup.find("div",{"class" : "saveMoneyInfo"}).text
            if '적립금 사용이 불가' in ssg_brand_percent:
                ssg_percent = 0
            else:
                ssg_percent = int(soup.find("div",{"class" : "saveMoneyInfo"}).find("span").text.replace("%",""))
        except:
            ssg_percent = 0


        if '서비스 이용에 불편을 드려 죄송합니다.' in html:
            print("No price/No price/neg")
            # productInfo_ssg.append(['','', '', '','','','','', '','',''])

        else:

            if 'el_wrapper' in html:    #http://www.ssgdfm.com/brandShop/esteelauder/spp?isRedirect=Y&prdtCode=01079000154  퍼센트없음

                ssg_title = soup.find("h4",{"id" : "dispPrdtGroupName"}).text.replace("\t","").replace("  ","")

                ssg_price1 = soup.find("em",{"id" : "totalAmtDal"}).text.strip().replace("$","")
                if ".00" in ssg_price1:
                    ssg_discount_price = ssg_price1.replace(".00","")
                else:
                    ssg_discount_price = ssg_price1
                ssg_product_info = soup.find("table").find("tbody").find_all("td")
                ssg_sell_price = ssg_product_info[2].text.split("(")[0].replace("$","").strip()
                if ".00" in ssg_sell_price:
                    ssg_sell_price = ssg_sell_price.replace(".00","")



            elif 'cl_wrap' in html:    #http://www.ssgdfm.com/brandShop/clinique/spp?isRedirect=Y&prdtCode=02950100001  퍼센트없음
                ssg_price1 = soup.find("strong",{"id" : "totalAmtDal"}).text.strip().replace("$","")
                if ".00" in ssg_price1:
                    ssg_discount_price = ssg_price1.replace(".00","")
                else:
                    ssg_discount_price = ssg_price1
                ssg_sell_price = soup.find("div",{"class" : "prod_buyinfo"}).find_all("td")[2].text.split("(")[0].replace("$","").strip()
                if ".00" in ssg_sell_price:
                    ssg_sell_price = ssg_sell_price.replace(".00","")

            elif 'lamerwrap' in html:      #http://www.ssgdfm.com/brandShop/lamer/spp?mode=all&prdtCode=06529000002  퍼센트없음
                ssg_product_info = soup.find("div",{"class" : "prodSpec"}).find_all("td")
                ssg_sell_price = ssg_product_info[2].text.split("(")[0].strip().replace("$","")
                if ".00" in ssg_sell_price:
                    ssg_sell_price = ssg_sell_price.replace(".00","")

                ssg_price1 = soup.find("em",{"id" : "totalAmtDal"}).text.strip().replace("$","")
                if ".00" in ssg_price1:
                    ssg_discount_price = ssg_price1.replace(".00","")
                else:
                    ssg_discount_price = ssg_price1

            elif 'bbwrap' in html: #http://www.ssgdfm.com/brandShop/bobbibrown/spp?mode=&prdtCode=07349000744&ctgrId=04030101 퍼센트없음
                ssg_product_info = soup.find("div",{"class" : "prodInfoTbl"}).find_all("td")
                ssg_sell_price = ssg_product_info[2].text.split("(")[0].replace("$","").strip()
                if ".00" in ssg_sell_price:
                    ssg_sell_price = ssg_sell_price.replace(".00","")

                ssg_price1 = soup.find("em",{"id" : "totalAmtDal"}).text.strip().replace("$","")
                if ".00" in ssg_price1:
                    ssg_discount_price = ssg_price1.replace(".00","")
                else:
                    ssg_discount_price = ssg_price1


            elif 'dp_wrapper' in html: #http://www.ssgdfm.com/brandShop/darphin/viewItem?isRedirect=Y&prdtCode=73239000033 퍼센트없음
                ssg_product_info = soup.find("div",{"class" : "infoTable"}).find_all("td")
                ssg_sell_price = html.split("prdtSellPriceDal")[1].split('"')[1]
                if ".00" in ssg_sell_price:
                    ssg_sell_price = ssg_sell_price.replace(".00","")

                ssg_price1 = soup.find("em",{"id" : "totalAmtDal"}).text.strip().replace("$","")
                if ".00" in ssg_price1:
                    ssg_discount_price = ssg_price1.replace(".00","")
                else:
                    ssg_discount_price = ssg_price1



            elif 'mac_container' in html:    #http://www.ssgdfm.com/brandShop/mac/viewItem?isRedirect=Y&prdtCode=05029000041 퍼센트없음
                ssg_product_info = soup.find("div",{"class" : "buy_box"}).find_all("span")
                ssg_sell_price = html.split("prdtSellPriceDal")[1].split('"')[1]
                if ".00" in ssg_sell_price:
                    ssg_sell_price = ssg_sell_price.replace(".00","")

                ssg_price1 = soup.find("em",{"id" : "totalAmtDal"}).text.strip().replace("$","")
                if ".00" in ssg_price1:
                    ssg_discount_price = ssg_price1.replace(".00","")
                else:
                    ssg_discount_price = ssg_price1


            elif 'avd_wrap' in html:  #http://www.ssgdfm.com/brandShop/aveda/spp?prdtCode=06749000149&ctgrId=  퍼센트없음
                ssg_product_info = soup.find("div",{"class" : "prod_buyinfo"}).find_all("td")
                ssg_sell_price = ssg_product_info[2].text.split("(")[0].replace("$","").strip()
                if ".00" in ssg_sell_price:
                    ssg_sell_price = ssg_sell_price.replace(".00","")

                ssg_price1 = soup.find("em",{"id" : "totalAmtDal"}).text.strip().replace("$","")
                if ".00" in ssg_price1:
                    ssg_discount_price = ssg_price1.replace(".00","")
                else:
                    ssg_discount_price = ssg_price1



            elif 'diorlogo2' in html:    #http://www.ssgdfm.com/brandShop/dior/spp?prdtCode=00109003718  퍼센트없음
                ssg_product_info = soup.find("div",{"class" : "buy_box"}).find_all("p")
                ssg_sell_price = ssg_product_info[2].text.split("(")[0].replace("$","").strip()
                if ".00" in ssg_sell_price:
                    ssg_sell_price = ssg_sell_price.replace(".00","")

                ssg_price1 = soup.find("em",{"id" : "totalAmtDal"}).text.strip().replace("$","")
                if ".00" in ssg_price1:
                    ssg_discount_price = ssg_price1.replace(".00","")
                else:
                    ssg_discount_price = ssg_price1

            elif 'jmwrap' in html:   #http://www.ssgdfm.com/brandShop/jomalone/spp?mode=&ctgrId=050304&prdtCode=06569000079 퍼센트없
                ssg_product_info = soup.find("div",{"class" : "prodInfo"}).find_all("td")
                ssg_sell_price = ssg_product_info[2].text.split("(")[0].replace("$","").strip()
                if ".00" in ssg_sell_price:
                    ssg_sell_price = ssg_sell_price.replace(".00","")

                ssg_price1 = soup.find("em",{"id" : "totalAmtDal"}).text.strip().replace("$","")
                if ".00" in ssg_price1:
                    ssg_discount_price = ssg_price1.replace(".00","")
                else:
                    ssg_discount_price = ssg_price1

            else:

                ssg_sell_price = soup.find("td",{"class" : "sell-price"}).find("strong").text.strip().replace("$","")
                if ".00" in ssg_sell_price:
                    ssg_sell_price = ssg_sell_price.replace(".00","")

                ssg_price1 = soup.find("span",{"id" : "totalAmtDal"}).text.strip().replace("$","")
                if ".00" in ssg_price1:
                    ssg_discount_price = ssg_price1.replace(".00","")
                else:
                    ssg_discount_price = ssg_price1

        print(ssg_sell_price+"/"+ssg_discount_price+"/"+ssg_product_ps+"/"+str(ssg_percent))

    except UnexpectedAlertPresentException:
        Alert(driver).dismiss()
        driver.quit()
        print("No price/"+"neg")

    # except:
    #     print("No price/No storage")


ssg_sele(sys.argv[1])
