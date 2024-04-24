from charm.toolbox.pairinggroup import PairingGroup, GT
from ABE.ac17 import AC17CPABE

# instantiate a bilinear pairing map
pairing_group = PairingGroup('MNT224')

# AC17 CP-ABE under DLIN (2-linear)
cpabe = AC17CPABE(pairing_group, 2)

# choose a random message
msg = pairing_group.random(GT)

# 加密
policy_str = '(ONE OR TWO OR THREE)'
ctxt = cpabe.encrypt('公钥替代', msg, policy_str)


# decryption
rec_msg1 = cpabe.decrypt('公钥替代', ctxt, ed_key)
rec_msg2 = cpabe.decrypt('公钥替代', ctxt, hu_key)
rec_msg3 = cpabe.decrypt('公钥替代', ctxt, bk_key)

print('yuanshimsg:'+msg)
print('yuanshimsg:'+rec_msg1)
print('yuanshimsg:'+rec_msg2)
print('yuanshimsg:'+rec_msg3)