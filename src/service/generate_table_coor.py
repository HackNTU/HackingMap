# TODO: 應該將這些直接寫在 appconfig.js
col = [218, 239, 260, 281, 326, 347, 368, 389]
row = [191, 219, 246, 274, 301, 329, 356, 384, 411, 437, 467, 494, 519, 546, 575, 602, 630, 657]

for i in range(len(row)):
    line = ''
    for j in range(len(col)):
        table_no = 8 * i + j + 1
        line += str(table_no) + ': {no: ' + str(table_no) + ', x: ' + str(col[j]) + ', y: ' + str(row[i]) + '}, '
    print(line)

# custom coordinates
print('145: {no: 145, x: 481, y: 98},')
print('149: {no: 149, x: 499, y: 214}')
