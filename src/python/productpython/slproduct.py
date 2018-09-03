from time import sleep
from bs4 import BeautifulSoup
import re
import requests

import sys

def remove_html_tags(data):
    p = re.compile(r'<.*?>')
    return p.sub('\n', data)

def shilla_2(url):
    try:
        req = requests.get(url)
         # HTML 소스 가져오기
        html = req.text
        soup = BeautifulSoup(html, 'html.parser')
        if 'desc pd-name' in html:      #대부분의 페이지에서 가격과 브랜드, 레퍼런스 넘버 가져오기
            if 'pd-discount' in html:
                sl_product_price1 = soup.find("span",{"class" : "pd-sale"}).text
                sl_price_tmp1 = sl_product_price1.split("(")
                sl_product_normal_price = sl_price_tmp1[0]
                sl_product_price2 = soup.find("em",{"class" : "pd-discount"}).text
                sl_price_tmp2 = sl_product_price2.split("(")
                sl_product_sale_price = sl_price_tmp2[0]
            else:
                sl_product_price = soup.find("span",{"class" : "pd-sale"}).text
                sl_price_tmp = sl_product_price.split("(")
                sl_product_normal_price = sl_price_tmp[0]
                sl_product_sale_price = '로그인 필요'
        elif 'dp_wrapper' in html:
            sl_price = soup.select('#dp_wrapper > div.contents > div.prodView > div.rightSection > div.infoTable > table > tbody > tr:nth-of-type(3) > td')
            sl_price_tmp = remove_html_tags(str(sl_price[0]))
            sl_price_tmp2 = sl_price_tmp.split('(')
            sl_product_normal_price = sl_price_tmp2[0].replace(" ","").replace("$","")
            sl_product_sale_price ="로그인 필요"

        elif 'jmwrap' in html:
            sl_price = soup.select('#wrap > div.jmwrap > div.jmcontents > div.pSection1.clfix > div.prodInfo > div > table > tbody > tr:nth-of-type(3) > td')
            sl_price_tmp = remove_html_tags(str(sl_price[0]))
            sl_price_tmp2 = sl_price_tmp.split('(')
            sl_product_normal_price = sl_price_tmp2[0].replace(" ","").replace("$","").replace("\n","")
            sl_product_sale_price ="로그인 필요"

        elif 'avd_wrap' in html:
            sl_price = soup.select('#tab_sec1 > div.prod_buyinfo > table > tbody > tr:nth-of-type(3) > td')
            sl_price_tmp = remove_html_tags(str(sl_price[0]))
            sl_price_tmp2 = sl_price_tmp.split('(')
            sl_product_normal_price = sl_price_tmp2[0].replace(" ","").replace("$","").replace("\n","")
            sl_product_sale_price ="로그인 필요"

        elif 'bobbibrownMenu' in html:
            sl_price = soup.select('#container > div > div.bbcontents > div.prodWrap > div.prodLeft > div.prodInfoN > div.prodInfoLeft > div.prodInfoTbl > table > tbody > tr:nth-of-type(3) > td')
            sl_price_tmp = remove_html_tags(str(sl_price[0]))
            sl_price_tmp2 = sl_price_tmp.split('\n')
            sl_product_normal_price = sl_price_tmp2[1].replace("$","")
            try:
                sl_product_price2 = soup.select('#container > div > div.bbcontents > div.prodWrap > div.prodLeft > div.prodInfoN > div.prodInfoLeft > div.prodInfoTbl > table > tbody > tr:nth-of-type(4) > td')
                sl_product_tmp2 = remove_html_tags(str(sl_product_price2[0])).replace('\t','').replace('\n','').replace('\r','').split('(')
                sl_product_sale_price = sl_product_tmp2[0].replace('$','')
            except:
                sl_product_sale_price ="로그인 필요"

        elif 'lamerwrap' in html:
            sl_price = soup.select('#lamerwrap > div > div.prodDetail > div.sectionR > div.prodSpec > table')
            sl_price_tmp = remove_html_tags(str(sl_price[0]))
            sl_price_tmp2 = sl_price_tmp.split('$')
            sl_price_tmp3 = sl_price_tmp2[1].replace(" ","").split('(')
            sl_product_normal_price = sl_price_tmp3[0]
            sl_product_sale_price ="로그인 필요"

        elif 'diorlogo2' in html:
            sl_price = soup.find("span",{"class" : "basic_price"})
            sl_price_tmp = str(sl_price).replace('\n','').split('$')
            sl_price_tmp2 = sl_price_tmp[1].split('<')
            sl_product_normal_price = sl_price_tmp2[0].replace(" ","").replace("$","").replace("\n","")
            sl_product_sale_price = "로그인 필요"

        elif 'Estee Lauder' in html:
            sl_price = soup.select('#tabsdiv-1 > table > tbody > tr:nth-of-type(3) > td > strong')
            sl_price_tmp = remove_html_tags(str(sl_price[0]))
            sl_price_tmp2 = sl_price_tmp.replace("\n","").split('(')
            sl_product_normal_price = sl_price_tmp2[0].replace("$","")
            sl_product_sale_price = "로그인 필요"

        elif 'fresh-wrap kr' in html:
            sl_price = soup.select('#wrap > div.fresh-wrap.kr > div.detail > div.content > div.info > div.desc > p.t3')
            sl_price_tmp = remove_html_tags(str(sl_price[0]))
            sl_price_tmp2 = sl_price_tmp.split(')')
            sl_price_tmp3 = sl_price_tmp2[1].split('(')
            sl_product_normal_price = sl_price_tmp3[0].replace("\n","").replace(" ","").replace("$","")
            sl_product_sale_price = "로그인 필요"

        elif 'maclogo' in html:
            sl_price = soup.select('#container > div.detailcontent > div.priceInfo > div > p:nth-of-type(3) > em')
            sl_price_tmp = remove_html_tags(str(sl_price[0]))
            sl_product_normal_price = sl_price_tmp.replace("\n","")
            sl_product_sale_price = "로그인 필요"

        elif 'lancome' in html:  #http://www.shilladfs.com/estore/kr/ko/Skin-Care/Basic-Skin-Care/Lotion/p/3325920
            sl_price = soup.find("div",{"class":"prd_price"}).find("strong")
            sl_price_tmp = remove_html_tags(str(sl_price))
            sl_product_normal_price = sl_price_tmp.replace("\n","")
            sl_product_sale_price = "로그인 필요"

        elif 'gucciwatch' in html:  #http://www.shilladfs.com/estore/kr/ko/Watch-Jewelry/Watch/Luxury/p/3209697
            sl_price = soup.find_all("span",{"class":"pd-sale"})
            sl_product_normal_price = sl_price[2].text.replace("\n","").replace("\r","").replace("\t","")
            sl_product_sale_price = "로그인 필요"

        elif 'biotherm' in html:  #http://www.shilladfs.com/estore/kr/ko/Skin-Care/Basic-Skin-Care/Lotion/p/3325920
            sl_price = soup.select("#wrap > div.biotherm_wrap.homme > div.brand_area > div > div > div.prd_detail > div.prd_detail_view > div.right_detail > div:nth-of-type(1) > dl > dd")    #상품이름 가져오기
            sl_price_string = str(sl_price)
            sl_price_tmp = remove_html_tags(sl_price_string)
            sl_price_tmp2 = sl_price_tmp.replace(" ","").replace("\n","").replace("\r","").replace("\t","").replace("dd","").replace("[","")
            sl_price_tmp3 = sl_price_tmp2.split("(")
            sl_product_normal_price = sl_price_tmp3[0]
            sl_product_sale_price = "로그인 필요"

        elif 'kiehls_wrap' in html:        #예외적인 페이지가 있음 ex) http://www.shilladfs.com/estore/kr/ko/p/72534
            sl_price = soup.find("div",{"class" : "prd_price"}).find("dl",{"class" : "prd_info_guide normal"}).find("dd").find("strong")
            sl_price_tmp = remove_html_tags(str(sl_price))
            sl_product_normal_price = sl_price_tmp.replace("\n","")
            sl_product_sale_price = "로그인 필요"

        elif 'pro_info clfix' in html:  #http://www.shilladfs.com/estore/kr/ko/Clinique/Clinique-Desktop/Basic-Care/By-3-Step/Step3-Moisturizing/p/302713
            sl_price = soup.find("span",{"class":"info_txt1"})
            sl_price_string = str(sl_price)
            sl_price_tmp = remove_html_tags(sl_price_string)
            sl_price_tmp2 = sl_price_tmp.replace(" ","").replace("\n","").replace("\r","")
            sl_price_tmp3 = sl_price_tmp2.split("(")
            sl_product_normal_price = sl_price_tmp3[0]
            sl_product_sale_price = "로그인 필요"
        else:
            sl_product_normal_price = ''
            sl_product_sale_price =''

        if '재입고알림 신청' in html:   #일시품점일 경우 neg, 재고가 남아 있을 경우 pos
            sl_product_ps = 'neg'
        elif '스페셜 오더' in html:
            sl_product_ps = 'neg'
        else:
            sl_product_ps = 'pos'

        sl_product_normal_price=sl_product_normal_price.replace("$","")
        print(sl_product_normal_price+"/"+sl_product_sale_price+"/"+sl_product_ps)
    except:
        print("No price/No price/No storage")





shilla_2(sys.argv[1])
