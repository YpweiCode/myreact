
(function($w) {

  if(typeof $w.RSAUtils === 'undefined')
    var RSAUtils = $w.RSAUtils = {};

  var biRadixBase = 2;
  var biRadixBits = 16;
  var bitsPerDigit = biRadixBits;
  var biRadix = 1 << 16; // = 2^16 = 65536
  var biHalfRadix = biRadix >>> 1;
  var biRadixSquared = biRadix * biRadix;
  var maxDigitVal = biRadix - 1;
  var maxInteger = 9999999999999998;
  var maxDigits;
  var ZERO_ARRAY;
  var bigZero, bigOne;

  var BigInt  = function(flag) {
    if (typeof flag == "boolean" && flag == true) {
      this.digits = null;
    } else {
      this.digits = ZERO_ARRAY.slice(0);
    }
    this.isNeg = false;
  };

  RSAUtils.setMaxDigits = function(value) {
    maxDigits = value;
    ZERO_ARRAY = new Array(maxDigits);
    for (var iza = 0; iza < ZERO_ARRAY.length; iza++) ZERO_ARRAY[iza] = 0;
    bigZero = new BigInt();
    bigOne = new BigInt();
    bigOne.digits[0] = 1;
  };
  RSAUtils.setMaxDigits(20);

//The maximum number of digits in base 10 you can convert to an
//integer without JavaScript throwing up on you.
  var dpl10 = 15;

  RSAUtils.biFromNumber = function(i) {
    var rsaResult = new BigInt();
    rsaResult.isNeg = i < 0;
    i = Math.abs(i);
    var j = 0;
    while (i > 0) {
      rsaResult.digits[j++] = i & maxDigitVal;
      i = Math.floor(i / biRadix);
    }
    return rsaResult;
  };

//lr10 = 10 ^ dpl10
  var lr10 = RSAUtils.biFromNumber(1000000000000000);

  RSAUtils.biFromDecimal = function(s) {
    var isNeg = s.charAt(0) == '-';
    var i = isNeg ? 1 : 0;
    var rsaResult;
    // Skip leading zeros.
    while (i < s.length && s.charAt(i) == '0') ++i;
    if (i == s.length) {
      rsaResult = new BigInt();
    }
    else {
      var digitCount = s.length - i;
      var fgl = digitCount % dpl10;
      if (fgl == 0) fgl = dpl10;
      rsaResult = RSAUtils.biFromNumber(Number(s.substr(i, fgl)));
      i += fgl;
      while (i < s.length) {
        rsaResult = RSAUtils.biAdd(RSAUtils.biMultiply(rsaResult, lr10),
          RSAUtils.biFromNumber(Number(s.substr(i, dpl10))));
        i += dpl10;
      }
      rsaResult.isNeg = isNeg;
    }
    return rsaResult;
  };

  RSAUtils.biCopy = function(bi) {
    var rsaResult = new BigInt(true);
    rsaResult.digits = bi.digits.slice(0);
    rsaResult.isNeg = bi.isNeg;
    return rsaResult;
  };

  RSAUtils.reverseStr = function(s) {
    var rsaResult = "";
    for (var i = s.length - 1; i > -1; --i) {
      rsaResult += s.charAt(i);
    }
    return rsaResult;
  };

  var hexatrigesimalToChar = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
    'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
    'u', 'v', 'w', 'x', 'y', 'z'
  ];

  RSAUtils.biToString = function(x, radix) { // 2 <= radix <= 36
    var b = new BigInt();
    b.digits[0] = radix;
    var qr = RSAUtils.biDivideModulo(x, b);
    var rsaResult = hexatrigesimalToChar[qr[1].digits[0]];
    while (RSAUtils.biCompare(qr[0], bigZero) == 1) {
      qr = RSAUtils.biDivideModulo(qr[0], b);
      digit = qr[1].digits[0];
      rsaResult += hexatrigesimalToChar[qr[1].digits[0]];
    }
    return (x.isNeg ? "-" : "") + RSAUtils.reverseStr(rsaResult);
  };

  RSAUtils.biToDecimal = function(x) {
    var b = new BigInt();
    b.digits[0] = 10;
    var qr = RSAUtils.biDivideModulo(x, b);
    var rsaResult = String(qr[1].digits[0]);
    while (RSAUtils.biCompare(qr[0], bigZero) == 1) {
      qr = RSAUtils.biDivideModulo(qr[0], b);
      rsaResult += String(qr[1].digits[0]);
    }
    return (x.isNeg ? "-" : "") + RSAUtils.reverseStr(rsaResult);
  };

  var hexToChar = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    'a', 'b', 'c', 'd', 'e', 'f'];

  RSAUtils.digitToHex = function(n) {
    var mask = 0xf;
    var rsaResult = "";
    for (var i = 0; i < 4; ++i) {
      rsaResult += hexToChar[n & mask];
      n >>>= 4;
    }
    return RSAUtils.reverseStr(rsaResult);
  };

  RSAUtils.biToHex = function(x) {
    var rsaResult = "";
    var n = RSAUtils.biHighIndex(x);
    for (var i = RSAUtils.biHighIndex(x); i > -1; --i) {
      rsaResult += RSAUtils.digitToHex(x.digits[i]);
    }
    return rsaResult;
  };

  RSAUtils.charToHex = function(c) {
    var ZERO = 48;
    var NINE = ZERO + 9;
    var littleA = 97;
    var littleZ = littleA + 25;
    var bigA = 65;
    var bigZ = 65 + 25;
    var rsaResult;

    if (c >= ZERO && c <= NINE) {
      rsaResult = c - ZERO;
    } else if (c >= bigA && c <= bigZ) {
      rsaResult = 10 + c - bigA;
    } else if (c >= littleA && c <= littleZ) {
      rsaResult = 10 + c - littleA;
    } else {
      rsaResult = 0;
    }
    return rsaResult;
  };

  RSAUtils.hexToDigit = function(s) {
    var rsaResult = 0;
    var sl = Math.min(s.length, 4);
    for (var i = 0; i < sl; ++i) {
      rsaResult <<= 4;
      rsaResult |= RSAUtils.charToHex(s.charCodeAt(i));
    }
    return rsaResult;
  };

  RSAUtils.biFromHex = function(s) {
    var rsaResult = new BigInt();
    var sl = s.length;
    for (var i = sl, j = 0; i > 0; i -= 4, ++j) {
      rsaResult.digits[j] = RSAUtils.hexToDigit(s.substr(Math.max(i - 4, 0), Math.min(i, 4)));
    }
    return rsaResult;
  };

  RSAUtils.biFromString = function(s, radix) {
    var isNeg = s.charAt(0) == '-';
    var istop = isNeg ? 1 : 0;
    var rsaResult = new BigInt();
    var place = new BigInt();
    place.digits[0] = 1; // radix^0
    for (var i = s.length - 1; i >= istop; i--) {
      var c = s.charCodeAt(i);
      var digit = RSAUtils.charToHex(c);
      var biDigit = RSAUtils.biMultiplyDigit(place, digit);
      rsaResult = RSAUtils.biAdd(rsaResult, biDigit);
      place = RSAUtils.biMultiplyDigit(place, radix);
    }
    rsaResult.isNeg = isNeg;
    return rsaResult;
  };

  RSAUtils.biDump = function(b) {
    return (b.isNeg ? "-" : "") + b.digits.join(" ");
  };

  RSAUtils.biAdd = function(x, y) {
    var rsaResult;

    if (x.isNeg != y.isNeg) {
      y.isNeg = !y.isNeg;
      rsaResult = RSAUtils.biSubtract(x, y);
      y.isNeg = !y.isNeg;
    }
    else {
      rsaResult = new BigInt();
      var c = 0;
      var n;
      for (var i = 0; i < x.digits.length; ++i) {
        n = x.digits[i] + y.digits[i] + c;
        rsaResult.digits[i] = n % biRadix;
        c = Number(n >= biRadix);
      }
      rsaResult.isNeg = x.isNeg;
    }
    return rsaResult;
  };

  RSAUtils.biSubtract = function(x, y) {
    var rsaResult;
    if (x.isNeg != y.isNeg) {
      y.isNeg = !y.isNeg;
      rsaResult = RSAUtils.biAdd(x, y);
      y.isNeg = !y.isNeg;
    } else {
      rsaResult = new BigInt();
      var n, c;
      c = 0;
      for (var i = 0; i < x.digits.length; ++i) {
        n = x.digits[i] - y.digits[i] + c;
        rsaResult.digits[i] = n % biRadix;
        // Stupid non-conforming modulus operation.
        if (rsaResult.digits[i] < 0) rsaResult.digits[i] += biRadix;
        c = 0 - Number(n < 0);
      }
      // Fix up the negative sign, if any.
      if (c == -1) {
        c = 0;
        for (var i = 0; i < x.digits.length; ++i) {
          n = 0 - rsaResult.digits[i] + c;
          rsaResult.digits[i] = n % biRadix;
          // Stupid non-conforming modulus operation.
          if (rsaResult.digits[i] < 0) rsaResult.digits[i] += biRadix;
          c = 0 - Number(n < 0);
        }
        // rsaResult is opposite sign of arguments.
        rsaResult.isNeg = !x.isNeg;
      } else {
        // rsaResult is same sign.
        rsaResult.isNeg = x.isNeg;
      }
    }
    return rsaResult;
  };

  RSAUtils.biHighIndex = function(x) {
    var rsaResult = x.digits.length - 1;
    while (rsaResult > 0 && x.digits[rsaResult] == 0) --rsaResult;
    return rsaResult;
  };

  RSAUtils.biNumBits = function(x) {
    var n = RSAUtils.biHighIndex(x);
    var d = x.digits[n];
    var m = (n + 1) * bitsPerDigit;
    var rsaResult;
    for (rsaResult = m; rsaResult > m - bitsPerDigit; --rsaResult) {
      if ((d & 0x8000) != 0) break;
      d <<= 1;
    }
    return rsaResult;
  };

  RSAUtils.biMultiply = function(x, y) {
    var rsaResult = new BigInt();
    var c;
    var n = RSAUtils.biHighIndex(x);
    var t = RSAUtils.biHighIndex(y);
    var u, uv, k;

    for (var i = 0; i <= t; ++i) {
      c = 0;
      k = i;
      for (var j = 0; j <= n; ++j, ++k) {
        uv = rsaResult.digits[k] + x.digits[j] * y.digits[i] + c;
        rsaResult.digits[k] = uv & maxDigitVal;
        c = uv >>> biRadixBits;
        //c = Math.floor(uv / biRadix);
      }
      rsaResult.digits[i + n + 1] = c;
    }
    // Someone give me a logical xor, please.
    rsaResult.isNeg = x.isNeg != y.isNeg;
    return rsaResult;
  };

  RSAUtils.biMultiplyDigit = function(x, y) {
    var n, c, uv;

    var rsaResult = new BigInt();
    n = RSAUtils.biHighIndex(x);
    c = 0;
    for (var j = 0; j <= n; ++j) {
      uv = rsaResult.digits[j] + x.digits[j] * y + c;
      rsaResult.digits[j] = uv & maxDigitVal;
      c = uv >>> biRadixBits;
      //c = Math.floor(uv / biRadix);
    }
    rsaResult.digits[1 + n] = c;
    return rsaResult;
  };

  RSAUtils.arrayCopy = function(src, srcStart, dest, destStart, n) {
    var m = Math.min(srcStart + n, src.length);
    for (var i = srcStart, j = destStart; i < m; ++i, ++j) {
      dest[j] = src[i];
    }
  };

  var highBitMasks = [0x0000, 0x8000, 0xC000, 0xE000, 0xF000, 0xF800,
    0xFC00, 0xFE00, 0xFF00, 0xFF80, 0xFFC0, 0xFFE0,
    0xFFF0, 0xFFF8, 0xFFFC, 0xFFFE, 0xFFFF];

  RSAUtils.biShiftLeft = function(x, n) {
    var digitCount = Math.floor(n / bitsPerDigit);
    var rsaResult = new BigInt();
    RSAUtils.arrayCopy(x.digits, 0, rsaResult.digits, digitCount,
      rsaResult.digits.length - digitCount);
    var bits = n % bitsPerDigit;
    var rightBits = bitsPerDigit - bits;
    for (var i = rsaResult.digits.length - 1, i1 = i - 1; i > 0; --i, --i1) {
      rsaResult.digits[i] = ((rsaResult.digits[i] << bits) & maxDigitVal) |
        ((rsaResult.digits[i1] & highBitMasks[bits]) >>>
          (rightBits));
    }
    rsaResult.digits[0] = ((rsaResult.digits[i] << bits) & maxDigitVal);
    rsaResult.isNeg = x.isNeg;
    return rsaResult;
  };

  var lowBitMasks = [0x0000, 0x0001, 0x0003, 0x0007, 0x000F, 0x001F,
    0x003F, 0x007F, 0x00FF, 0x01FF, 0x03FF, 0x07FF,
    0x0FFF, 0x1FFF, 0x3FFF, 0x7FFF, 0xFFFF];

  RSAUtils.biShiftRight = function(x, n) {
    var digitCount = Math.floor(n / bitsPerDigit);
    var rsaResult = new BigInt();
    RSAUtils.arrayCopy(x.digits, digitCount, rsaResult.digits, 0,
      x.digits.length - digitCount);
    var bits = n % bitsPerDigit;
    var leftBits = bitsPerDigit - bits;
    for (var i = 0, i1 = i + 1; i < rsaResult.digits.length - 1; ++i, ++i1) {
      rsaResult.digits[i] = (rsaResult.digits[i] >>> bits) |
        ((rsaResult.digits[i1] & lowBitMasks[bits]) << leftBits);
    }
    rsaResult.digits[rsaResult.digits.length - 1] >>>= bits;
    rsaResult.isNeg = x.isNeg;
    return rsaResult;
  };

  RSAUtils.biMultiplyByRadixPower = function(x, n) {
    var rsaResult = new BigInt();
    RSAUtils.arrayCopy(x.digits, 0, rsaResult.digits, n, rsaResult.digits.length - n);
    return rsaResult;
  };

  RSAUtils.biDivideByRadixPower = function(x, n) {
    var rsaResult = new BigInt();
    RSAUtils.arrayCopy(x.digits, n, rsaResult.digits, 0, rsaResult.digits.length - n);
    return rsaResult;
  };

  RSAUtils.biModuloByRadixPower = function(x, n) {
    var rsaResult = new BigInt();
    RSAUtils.arrayCopy(x.digits, 0, rsaResult.digits, 0, n);
    return rsaResult;
  };

  RSAUtils.biCompare = function(x, y) {
    if (x.isNeg != y.isNeg) {
      return 1 - 2 * Number(x.isNeg);
    }
    for (var i = x.digits.length - 1; i >= 0; --i) {
      if (x.digits[i] != y.digits[i]) {
        if (x.isNeg) {
          return 1 - 2 * Number(x.digits[i] > y.digits[i]);
        } else {
          return 1 - 2 * Number(x.digits[i] < y.digits[i]);
        }
      }
    }
    return 0;
  };

  RSAUtils.biDivideModulo = function(x, y) {
    var nb = RSAUtils.biNumBits(x);
    var tb = RSAUtils.biNumBits(y);
    var origYIsNeg = y.isNeg;
    var q, r;
    if (nb < tb) {
      // |x| < |y|
      if (x.isNeg) {
        q = RSAUtils.biCopy(bigOne);
        q.isNeg = !y.isNeg;
        x.isNeg = false;
        y.isNeg = false;
        r = biSubtract(y, x);
        // Restore signs, 'cause they're references.
        x.isNeg = true;
        y.isNeg = origYIsNeg;
      } else {
        q = new BigInt();
        r = RSAUtils.biCopy(x);
      }
      return [q, r];
    }

    q = new BigInt();
    r = x;

    // Normalize Y.
    var t = Math.ceil(tb / bitsPerDigit) - 1;
    var lambda = 0;
    while (y.digits[t] < biHalfRadix) {
      y = RSAUtils.biShiftLeft(y, 1);
      ++lambda;
      ++tb;
      t = Math.ceil(tb / bitsPerDigit) - 1;
    }
    // Shift r over to keep the quotient constant. We'll shift the
    // remainder back at the end.
    r = RSAUtils.biShiftLeft(r, lambda);
    nb += lambda; // Update the bit count for x.
    var n = Math.ceil(nb / bitsPerDigit) - 1;

    var b = RSAUtils.biMultiplyByRadixPower(y, n - t);
    while (RSAUtils.biCompare(r, b) != -1) {
      ++q.digits[n - t];
      r = RSAUtils.biSubtract(r, b);
    }
    for (var i = n; i > t; --i) {
      var ri = (i >= r.digits.length) ? 0 : r.digits[i];
      var ri1 = (i - 1 >= r.digits.length) ? 0 : r.digits[i - 1];
      var ri2 = (i - 2 >= r.digits.length) ? 0 : r.digits[i - 2];
      var yt = (t >= y.digits.length) ? 0 : y.digits[t];
      var yt1 = (t - 1 >= y.digits.length) ? 0 : y.digits[t - 1];
      if (ri == yt) {
        q.digits[i - t - 1] = maxDigitVal;
      } else {
        q.digits[i - t - 1] = Math.floor((ri * biRadix + ri1) / yt);
      }

      var c1 = q.digits[i - t - 1] * ((yt * biRadix) + yt1);
      var c2 = (ri * biRadixSquared) + ((ri1 * biRadix) + ri2);
      while (c1 > c2) {
        --q.digits[i - t - 1];
        c1 = q.digits[i - t - 1] * ((yt * biRadix) | yt1);
        c2 = (ri * biRadix * biRadix) + ((ri1 * biRadix) + ri2);
      }

      b = RSAUtils.biMultiplyByRadixPower(y, i - t - 1);
      r = RSAUtils.biSubtract(r, RSAUtils.biMultiplyDigit(b, q.digits[i - t - 1]));
      if (r.isNeg) {
        r = RSAUtils.biAdd(r, b);
        --q.digits[i - t - 1];
      }
    }
    r = RSAUtils.biShiftRight(r, lambda);
    // Fiddle with the signs and stuff to make sure that 0 <= r < y.
    q.isNeg = x.isNeg != origYIsNeg;
    if (x.isNeg) {
      if (origYIsNeg) {
        q = RSAUtils.biAdd(q, bigOne);
      } else {
        q = RSAUtils.biSubtract(q, bigOne);
      }
      y = RSAUtils.biShiftRight(y, lambda);
      r = RSAUtils.biSubtract(y, r);
    }
    // Check for the unbelievably stupid degenerate case of r == -0.
    if (r.digits[0] == 0 && RSAUtils.biHighIndex(r) == 0) r.isNeg = false;

    return [q, r];
  };

  RSAUtils.biDivide = function(x, y) {
    return RSAUtils.biDivideModulo(x, y)[0];
  };

  RSAUtils.biModulo = function(x, y) {
    return RSAUtils.biDivideModulo(x, y)[1];
  };

  RSAUtils.biMultiplyMod = function(x, y, m) {
    return RSAUtils.biModulo(RSAUtils.biMultiply(x, y), m);
  };

  RSAUtils.biPow = function(x, y) {
    var rsaResult = bigOne;
    var a = x;
    while (true) {
      if ((y & 1) != 0) rsaResult = RSAUtils.biMultiply(rsaResult, a);
      y >>= 1;
      if (y == 0) break;
      a = RSAUtils.biMultiply(a, a);
    }
    return rsaResult;
  };

  RSAUtils.biPowMod = function(x, y, m) {
    var rsaResult = bigOne;
    var a = x;
    var k = y;
    while (true) {
      if ((k.digits[0] & 1) != 0) rsaResult = RSAUtils.biMultiplyMod(rsaResult, a, m);
      k = RSAUtils.biShiftRight(k, 1);
      if (k.digits[0] == 0 && RSAUtils.biHighIndex(k) == 0) break;
      a = RSAUtils.biMultiplyMod(a, a, m);
    }
    return rsaResult;
  };


  $w.BarrettMu = function(m) {
    this.modulus = RSAUtils.biCopy(m);
    this.k = RSAUtils.biHighIndex(this.modulus) + 1;
    var b2k = new BigInt();
    b2k.digits[2 * this.k] = 1; // b2k = b^(2k)
    this.mu = RSAUtils.biDivide(b2k, this.modulus);
    this.bkplus1 = new BigInt();
    this.bkplus1.digits[this.k + 1] = 1; // bkplus1 = b^(k+1)
    this.modulo = BarrettMu_modulo;
    this.multiplyMod = BarrettMu_multiplyMod;
    this.powMod = BarrettMu_powMod;
  };

  function BarrettMu_modulo(x) {
    var $dmath = RSAUtils;
    var q1 = $dmath.biDivideByRadixPower(x, this.k - 1);
    var q2 = $dmath.biMultiply(q1, this.mu);
    var q3 = $dmath.biDivideByRadixPower(q2, this.k + 1);
    var r1 = $dmath.biModuloByRadixPower(x, this.k + 1);
    var r2term = $dmath.biMultiply(q3, this.modulus);
    var r2 = $dmath.biModuloByRadixPower(r2term, this.k + 1);
    var r = $dmath.biSubtract(r1, r2);
    if (r.isNeg) {
      r = $dmath.biAdd(r, this.bkplus1);
    }
    var rgtem = $dmath.biCompare(r, this.modulus) >= 0;
    while (rgtem) {
      r = $dmath.biSubtract(r, this.modulus);
      rgtem = $dmath.biCompare(r, this.modulus) >= 0;
    }
    return r;
  }

  function BarrettMu_multiplyMod(x, y) {
    /*
      x = this.modulo(x);
      y = this.modulo(y);
      */
    var xy = RSAUtils.biMultiply(x, y);
    return this.modulo(xy);
  }

  function BarrettMu_powMod(x, y) {
    var rsaResult = new BigInt();
    rsaResult.digits[0] = 1;
    var a = x;
    var k = y;
    while (true) {
      if ((k.digits[0] & 1) != 0) rsaResult = this.multiplyMod(rsaResult, a);
      k = RSAUtils.biShiftRight(k, 1);
      if (k.digits[0] == 0 && RSAUtils.biHighIndex(k) == 0) break;
      a = this.multiplyMod(a, a);
    }
    return rsaResult;
  }

  var RSAKeyPair = function(encryptionExponent, decryptionExponent, modulus) {
    var $dmath = RSAUtils;
    this.e = $dmath.biFromHex(encryptionExponent);
    this.d = $dmath.biFromHex(decryptionExponent);
    this.m = $dmath.biFromHex(modulus);
    // We can do two bytes per digit, so
    // chunkSize = 2 * (number of digits in modulus - 1).
    // Since biHighIndex returns the high index, not the number of digits, 1 has
    // already been subtracted.
    this.chunkSize = 2 * $dmath.biHighIndex(this.m);
    this.radix = 16;
    this.barrett = new $w.BarrettMu(this.m);
  };

  RSAUtils.getKeyPair = function(encryptionExponent, decryptionExponent, modulus) {
    return new RSAKeyPair(encryptionExponent, decryptionExponent, modulus);
  };

  if(typeof $w.twoDigit === 'undefined') {
    $w.twoDigit = function(n) {
      return (n < 10 ? "0" : "") + String(n);
    };
  }

// Altered by Rob Saunders (rob@robsaunders.net). New routine pads the
// string after it has been converted to an array. This fixes an
// incompatibility with Flash MX's ActionScript.
  RSAUtils.encryptedString = function(key, s) {
    var a = [];
    var sl = s.length;
    var i = 0;
    while (i < sl) {
      a[i] = s.charCodeAt(i);
      i++;
    }

    while (a.length % key.chunkSize != 0) {
      a[i++] = 0;
    }

    var al = a.length;
    var rsaResult = "";
    var j, k, block;
    for (i = 0; i < al; i += key.chunkSize) {
      block = new BigInt();
      j = 0;
      for (k = i; k < i + key.chunkSize; ++j) {
        block.digits[j] = a[k++];
        block.digits[j] += a[k++] << 8;
      }
      var crypt = key.barrett.powMod(block, key.e);
      var text = key.radix == 16 ? RSAUtils.biToHex(crypt) : RSAUtils.biToString(crypt, key.radix);
      rsaResult += text + " ";
    }
    return rsaResult.substring(0, rsaResult.length - 1); // Remove last space.
  };

  RSAUtils.decryptedString = function(key, s) {
    var blocks = s.split(" ");
    var rsaResult = "";
    var i, j, block;
    for (i = 0; i < blocks.length; ++i) {
      var bi;
      if (key.radix == 16) {
        bi = RSAUtils.biFromHex(blocks[i]);
      }
      else {
        bi = RSAUtils.biFromString(blocks[i], key.radix);
      }
      block = key.barrett.powMod(bi, key.d);
      for (j = 0; j <= RSAUtils.biHighIndex(block); ++j) {
        rsaResult += String.fromCharCode(block.digits[j] & 255,
          block.digits[j] >> 8);
      }
    }
    // Remove trailing null, if any.
    if (rsaResult.charCodeAt(rsaResult.length - 1) == 0) {
      rsaResult = rsaResult.substring(0, rsaResult.length - 1);
    }
    return rsaResult;
  };

  RSAUtils.setMaxDigits(130);
  // return RSAUtils;

})(window);


module.exports = RSAUtils;
