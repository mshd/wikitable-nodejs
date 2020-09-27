const axios = require("axios");
const cheerio = require("cheerio");
const request = require('request');
const fetch = require('node-fetch');
const fs = require('fs');
const moment = require('moment');

let ids = [1320,1745,1333,1746,1747,1367,1748,1749,1399,1405,1750,1751,56,1752,1432,1435,59,1445,1753,1754,83,1755,64,1463,1465,62,1756,1634,1226,1757,1481,1628,1698,1758,1490,1491,1496,71,1503,1759,1760,1508,75,1229,1761,1762,1763,921,1764,1765,892,1766,1767,1558,1768,1769,1770,2011,1322,1880,1331,2012,1334,1881,1882,1348,1352,1883,1358,1362,2033,1884,1371,1374,290,1380,1885,1886,1888,1397,135,1889,1890,1411,1416,1891,157,1892,168,1428,1893,1894,1895,1438,2028,2029,190,1898,1461,1464,1466,1472,1114,1479,1899,1900,1492,1499,1506,1512,1516,268,1522,1527,1901,1902,279,1545,1903,1904,1905,1560,1565,1569,1907,1677,1583,1586,1592,1908,1603,1605,2013,2030,1330,913,1953,347,1954,1340,1955,1353,1357,1360,1956,1370,1005,1957,327,1683,1958,1959,250,1960,1962,1961,258,1390,1393,1394,259,1396,1401,1406,265,1413,270,262,1425,1963,1965,1964,276,1436,1652,1966,1967,1969,282,1968,283,1451,1971,1970,287,289,1456,2014,291,1973,294,1974,296,1975,1976,285,286,298,1977,1477,1476,1979,1978,300,1980,1981,305,1982,1983,303,1504,299,1636,1984,1985,1986,316,315,928,1525,318,1535,252,1987,1543,1988,247,1992,1990,1991,249,1989,332,1035,336,1993,1994,2015,320,1996,1997,1998,1999,2000,2001,2003,2002,2010,2005,2004,340,2006,1584,1591,2007,2008,2009];//,1607,1609,1614,1619,1321,1910,195,1911,1341,1912,1913,1351,1914,169,1915,1361,192,1916,194,1917,1918,1047,1919,1921,1920,1922,1923,1924,924,1925,105,1415,1418,1926,1927,1427,1426,1928,116,117,1159,1929,121,1452,1930,1931,127,1933,128,1471,1934,94,1483,531,1935,1498,1505,1511,1515,1936,1937,1938,2032,1939,1940,1544,85,1549,1941,162,1942,1718,1943,1944,80,1572,1945,149,1946,182,1585,176,1947,1948,1598,1949,1950,1951,166,1329,1835,1836,1837,1838,2016,1840,1841,1842,1843,1378,1849,1383,1392,1844,1845,1846,1847,1848,1850,1851,1852,1853,1854,1855,1487,1856,1857,1858,1502,1859,1860,1518,1861,1863,2034,1865,1864,1557,1866,1867,1868,1879,1869,1870,1582,1871,1872,1873,1874,1875,1876,1877,2017,1620,1616,1612,2018,1878,2026,544,781,2019,559,560,554,1796,547,1797,556,542,1644,1670,1798,526,2027,457,490,1803,1637,512,1703,1799,518,1800,1801,1802,515,521,1673,1804,1805,1455,1806,1469,1475,530,1807,1808,390,1809,1810,1811,1812,1567,540,2020,1590,2021,2022,1328,242,1772,1773,216,1440,1774,220,1624,1474,1494,1775,1659,1776,1777,232,1588,1778,1779,819,1337,50,1780,1349,1781,1356,7,1364,47,10,777,31,1782,25,1785,1403,1783,1412,8,1711,1424,1784,1439,1480,1486,22,1786,1787,1788,918,1547,33,1690,1789,1790,1791,1792,881,1793,1794,1704,2023,462,365,499,504,1687,492,495,1813,477,1363,1814,1372,455,1381,366,1815,376,1402,756,1816,392,1817,400,389,402,406,1818,1819,1820,1821,1822,424,437,1517,441,1523,1823,1824,2024,1825,1826,1680,1688,1827,473,1828,2025,1833,1829,1587,1830,1831,1832,1618];
const urls = ids.map((id) => {
  return "http://www.dpr.go.id/blog/profil/id/"+id;
});
//["http://www.dpr.go.id/blog/profil/id/406","http://www.dpr.go.id/blog/profil/id/499"];

let array = [];

function proccessMember($) {
  const lists =  $("div.col-md-9.mb30 div.link-list").children();
  const input =$("div.col-md-9.mb30 .keterangan .input");

  let extra = {};
  let personData = {
    name : $("h3").text(),
    email: $("div.col-md-9.mb30 h1").text(),
    birth: input.eq(1).text(),
    religion: input.eq(2).text(),
    // education : extra["Riwayat Pendidikan"],
    // work : extra["Riwayat Pekerjaan"],
    // organization: extra["Riwayat Organisasi"],

    extra: extra,

  };
  const birth = personData.birth.split("/");
  personData.birthPlace = birth[0];
  if(birth.length > 1){
    var momentObj = moment(birth[1], 'D MMMM YYYY', 'id');//12 Juni 1962
    personData.birthDate = momentObj.format('YYYY-MM-DD');
  }

  lists.each(function(i, item){
    let section =$(this).find("div.stitle").text();
    personData[section] = [];
    $(this).find("ul li").each(function(i, elm) {
      if("Data tidak ditemukan." !== $(this).text()) {
        personData[section].push($(this).text());
      }
    });
    if(section !== "Riwayat Pendidikan"){
      personData[section]= personData[section].reverse();
    }
    // let section = el("div.stitle").text();
  });


  return personData;
}

let i=0;
let requests = urls.map((url) => {
  i++;
  return axios.get(url, {
   timeout: i*1000,
    headers: {
      // 'Host': 'marketcheck-prod.apigee.net'
    }
  });
});

const timeOut = (t) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(`Completed in ${t}`)
    }, t)
  })
};

let members = [];
Promise.all(requests).then((responces) => {
  responces.map((res) => {
    // console.log(res.data);
    let $ = cheerio.load(res.data);
    let member = proccessMember($);
    member.url = res.request.path;
    // console.log(member);
    members.push(member);
  });
  console.log(members);
  let data = JSON.stringify(members);
  fs.writeFileSync('members.json', data);

}).catch((err) => {
  console.log(err)
});