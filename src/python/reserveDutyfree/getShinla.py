from selenium import webdriver
from bs4 import BeautifulSoup
import re
import os
import sys
def remove_html_tags(data):
    p = re.compile(r'<.*?>')
    return p.sub('\n', data)



dir_path = os.path.dirname(os.path.realpath(os.getcwd()))
driver = webdriver.Chrome('/home/cloudpool/Desktop/Capstone/chromedriver')


driver.get('https://www.shilladfs.com/estore/kr/ko/login')
driver.find_element_by_xpath('//*[@id="container"]/div[1]/div/div/div[2]/div/a').click()
driver.implicitly_wait(2)
window_before = driver.window_handles[0]
window_after = driver.window_handles[1]

driver.switch_to_window(window_after)

driver.find_element_by_name('j_username').send_keys(sys.argv[1])
driver.find_element_by_name('j_password').send_keys(sys.argv[2])
driver.find_element_by_xpath('//*[@id="loginForm"]/div/div/div/div[2]/div[1]/a').click()
driver.implicitly_wait(2)
driver.switch_to_window(window_before)
driver.find_element_by_xpath('//*[@id="header"]/div[2]/div/div[1]/ul/li[3]/a').click()
html = driver.page_source
soup = BeautifulSoup(html,'html.parser')
driver.quit()
reserved = str(soup.find("dl",{"class":"save"}).find("dd").find("span").find("em"))
price = remove_html_tags(reserved)
price = "".join(price.split());
print(price)
