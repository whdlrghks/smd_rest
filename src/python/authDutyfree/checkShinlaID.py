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
#http://www.shilladfs.com/estore/kr/ko/?uiel=Desktop success
#https://www.shilladfs.com/estore/kr/ko/login?error=true&popup=true&nextUrl=/estore/kr/ko fail
# dir_path = os.path.dirname(os.path.realpath(os.getcwd()))
# driver = webdriver.Chrome('/Users/ikhwan/capstone/chromedriver')

def reserved(driver):

    driver.find_element_by_xpath('//*[@id="header"]/div[2]/div/div[1]/ul/li[3]/a').click()
    html = driver.page_source
    soup = BeautifulSoup(html,'html.parser')
    driver.quit()
    reserved = str(soup.find("dl",{"class":"save"}).find("dd").find("span").find("em"))
    #원화 -> 달러 변환

    price = remove_html_tags(reserved)
    price = "".join(price.split());
    price = price.replace(",","")
    reserved_1 = int(price)/1100
    reserved_final = str(round(reserved_1,2))
    print('shinla success/'+reserved_final)

def checkShinlaID():
    options = webdriver.ChromeOptions()
    options.add_argument('headless')
    options.add_argument('window-size=1920x1080')
    options.add_argument("--disable-gpu")
    # 혹은 options.add_argument("--disable-gpu")

    driver = webdriver.Chrome('/Users/ikhwan/capstone/chromedriver', chrome_options=options)
    # driver = webdriver.Chrome('/Users/ikhwan/capstone/chromedriver')
    driver.get('https://www.shilladfs.com/estore/kr/ko/login')
    driver.find_element_by_xpath('//*[@id="container"]/div[1]/div/div/div[2]/div/a').click()
    driver.implicitly_wait(3)
    window_before = driver.window_handles[0]
    window_after = driver.window_handles[1]

    driver.switch_to_window(window_after)

    driver.find_element_by_name('j_username').send_keys(sys.argv[1])
    driver.find_element_by_name('j_password').send_keys(sys.argv[2])
    driver.find_element_by_xpath('//*[@id="loginForm"]/div/div/div/div[2]/div[1]/a').click()
    driver.implicitly_wait(7)

    try:
        result = driver.current_url
    except :
        driver.switch_to_window(window_before)
        result = driver.current_url



    # driver.quit()
    if result =='http://www.shilladfs.com/estore/kr/ko/?uiel=Desktop':
        reserved(driver)
        # print('shinla success')

    elif result =='https://www.shilladfs.com/estore/kr/ko/login?error=true&popup=true&nextUrl=/estore/kr/ko':
        driver.quit()
        print('shinla fail/')

    #else :
    #    print('shinla fail')

checkShinlaID();
