import gmpy2
import numpy as np
import random
import time
from keygen import generate_random_number

#Find the maximum number of conventions
def gcd(a,b):
    if b==0: return a
    else: return gcd(b, a%b)

# Extending Euclid's algorithm to find the modulo inverse
def findModReverse(a, m):

        if gcd(a, m) != 1:
            return None
        u1, u2, u3 = 1, 0, a
        v1, v2, v3 = 0, 1, m
        while v3 != 0:
            q = u3 // v3
            v1, v2, v3, u1, u2, u3 = (u1 - q * v1), (u2 - q * v2), (u3 - q * v3), v1, v2, v3
        return u1 % m


def divresult(m,):
    Mj = [1]* len(m)
    for i in range(0, len(m)):

        for j in range(0, len(m)):
            if (i == j):
                Mj[i] = Mj[i] * 1

            else:
                Mj[i] = Mj[i] * m[j]
    return Mj


#Solve for N and M
def fun1(d, t):
    N = 1
    M = 1
    for i in range(0,t):
        N=N*d[i]
    for i in range(len(d)-t+1, len(d)):
        M = M*d[i]
    return N, M


def getk(m,k,N,P):
    k1=[1]*len(m)
    r = random.randint(0,N//P-1)
    ks = k + r*P
    for i in range(0,len(m)):
        k1[i]=ks % m[i]
    k1=k1[0:len(m)]
    return k1, r

# Chinese residual definition to solve the equation
def ChineseSurplus(k,d,t,r,p):
    m = d[0:t]
    a = k[0:t]
    # Step1:Calculate the multiplication
    m1 = 1
    for i in range(0, len(m)):
        m1 = m1 * m[i]

    # Step2:Calculate Mj

    Mj = divresult(m)
    Mj1 = [0]* len(m)

    # Step3:Compute the inverse of the mode

    for i in range(0, len(m)):
        Mj1[i] = findModReverse(Mj[i], m[i])

    x = 0
    for i in range(0, len(m)):
        x = x + Mj[i] * Mj1[i] * a[i]
    result = x % m1
    return result - r*p


# Define the d array
# generate the appropriate d values

def judge1(m, num):
        flag1 = 1
        for i in range(0, num):
            for j in range(0, num):
                if (gcd(m[i], m[j]) != 1) & (i != j):
                    flag1 = 0
                    break
        return flag1

#generate m arrays
def getm(t, n, bit_k, k):
    P = -1
    m = [1]* n

    bit_d  = bit_k + n *int(n/5*2)
    #temp = random.randint(pow(10, 152), pow(10, 156)) # slower get large prime
    randfunc = random.SystemRandom()
    large_prime = gmpy2.mpz(randfunc.getrandbits(bit_d))
    large_prime = gmpy2.bit_set(large_prime, bit_d -1)
    temp = int(gmpy2.next_prime(large_prime))
    #temp = get_large_prime_bit_size(300) # slower get large prime
    #print(temp)
    m[0] = temp
    i = 1
    while (i < n):
        #temp = random.randint(pow(10, 152), pow(10, 160)) # slower get large prime
        large_prime = gmpy2.mpz(randfunc.getrandbits(bit_d+i))
        large_prime = gmpy2.bit_set(large_prime, bit_d +i- 1)
        temp = int(gmpy2.next_prime( large_prime))
        m[i] = temp
        # if (judge1(d, i + 1) == 1):  # slower get large prime
        i = i + 1

    N ,M = fun1(m, t)

    while(1):
        large_prime = gmpy2.mpz(randfunc.getrandbits(bit_k + 2))
        large_prime = gmpy2.bit_set(large_prime, bit_k - 1)
        temp = int(gmpy2.next_prime(large_prime))

        if (N > M * temp and temp > k):
            P = temp
            break
    return m, P  #获取正确的m数组

#Large 256-bit numbers as a test
def getNeed():
    k = generate_random_number(10)
    dict = {}
    print("S ", k)
    dict["S"] = k
    bit_k  = k.bit_length()
    #print("bits of k", bit_k)
    testlist = [5]

    timdis = []
    timrc = []

    round = 1

    for n in testlist:
        t = int(n/2)+1
        ti = []
        t2 = []
        for i in range(round):
            start_dis = time.time()
            m, P = getm(t, n, bit_k, k)
            dict["M"]=m
            dict["P"]=P
            print("m数组为: ")
            print(m)
            print("P为: ")
            print(P)
            # step2:计算N和M的值

            N, M = fun1(m, t)
            # 求k

            k1, r = getk(m, k, N, P)
            print("x: ")
            print(k1)
            dict["X"] = k1
            end_dis = time.time()

            ti.append(end_dis-start_dis)

            start = time.time()
            result = ChineseSurplus(k1, m, t, r, P)
            end = time.time()

            t2.append(end - start)

        timdis.append(sum(ti)/round)
        timrc.append(sum(t2)/round)
    return dict

