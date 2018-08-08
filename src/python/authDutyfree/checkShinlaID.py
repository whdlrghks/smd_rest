
from selenium import webdriver
from bs4 import BeautifulSoup
import sys
import os
#http://www.shilladfs.com/estore/kr/ko/?uiel=Desktop success
#https://www.shilladfs.com/estore/kr/ko/login?error=true&popup=true&nextUrl=/estore/kr/ko fail
dir_path = os.path.dirname(os.path.realpath(os.getcwd()))
driver = webdriver.Chrome('/home/cloudpool/Desktop/Capstone/chromedriver')

def checkShinlaID():
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

    driver.quit()
    if result =='http://www.shilladfs.com/estore/kr/ko/?uiel=Desktop':
        print('shinla success')

    elif result =='https://www.shilladfs.com/estore/kr/ko/login?error=true&popup=true&nextUrl=/estore/kr/ko':
        print('shinla fail')

    #else :
    #    print('shinla fail')

checkShinlaID();
