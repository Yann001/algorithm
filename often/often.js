define(function () {

  /**
   * @description 和最大的子数组：
   * 在一个包含负数的数组中，求出和最大的子数组，
   * 使用分治策略的方法求解
   * @param {array} array 
   */
  var findMaxSumSubArr1 = function (array) {
    var arr = array.slice();
    return f1(arr, 0, arr.length - 1);
    function f1(arr, left, right) {
      if (left == right) {
        return [left, right, arr[left]]
      } else {
        var mid = Math.floor((left + right) / 2);
        var lResult = f1(arr, left, mid);
        var rResult = f1(arr, mid + 1, right);
        var cResult = f2(arr, left, mid, right);
        var result = lResult[2] > rResult[2] ? lResult : rResult;
        return result[2] > cResult[2] ? result : cResult;
      }
    }
    // 最大子数组跨过中点的情况
    function f2(arr, left, mid, right) {
      var lSum = -Infinity,
        rSum = -Infinity,
        sum = 0,
        lIndex = mid,
        rIndex = mid;
      for (var i = mid; i >= left; i--) {
        sum += arr[i];
        if (sum > lSum) {
          lSum = sum;
          lIndex = i;
        }
      }
      sum = 0;
      for (var j = mid + 1; j <= right; j++) {
        sum += arr[j];
        if (sum > rSum) {
          rSum = sum;
          rIndex = j;
        }
      }
      return [lIndex, rIndex, lSum + rSum]
    }
  }
  /**
   * @description 和最大的子数组：
   * 在一个包含负数的数组中，求出和最大的子数组，
   * 使用动态规划的方法求解,
   * 设sum[i]为以第i个元素结尾且和最大的连续子数组。
   * 假设对于元素i，所有以它前面的元素结尾的子数组的长度都已经求得，
   * 那么以第i个元素结尾且和最大的连续子数组实际上，
   * 要么是以第i-1个元素结尾且和最大的连续子数组加上这个元素，
   * 要么是只包含第i个元素，即sum[i] = max(sum[i-1] + a[i], a[i])。
   * 可以通过判断sum[i-1] + a[i]是否大于a[i]来做选择，
   * 而这实际上等价于判断sum[i-1]是否大于0。
   * 由于每次运算只需要前一次的结果，因此并不需要像普通的动态规划那样保留之前所有的计算结果，
   * 只需要保留上一次的即可，因此算法的时间和空间复杂度都很小。
   * @param {array} array 
   */
  var findMaxSumSubArr2 = function (array) {
    var arr = array.slice();
    var len = arr.length;
    var ret = arr[0] - 0;
    var sum = ret;
    for (var i = 1; i < len; i++) { // 依次遍历以i结尾的和最大的子数组
      if (sum > 0) {
        sum += (arr[i] - 0);
      } else {
        sum = arr[i] - 0;
      }
      if (sum > ret) {
        ret = sum;
      }
    }
    return ret;
  }

  /**
   * @description 钢条切割问题：
   * 给出一段总长度为n的钢条，长度为i的钢条的价格为p[i]，
   * 求出分割后能使收益最大的方案。
   * （注：如果长度为n的钢条价格p[n]足够大，则完全不需要分割）
   */
  var cutSteel = {
    q: -Infinity,
    // 方法一：一般递归
    method1: function (prices, n) {
      if (n == 0) {
        return 0;
      }
      this.q = -Infinity;
      for (var i = 1; i < n; i++) {
        this.q = Math.max(this.q, prices[i] + this.method1(prices, n - i));
      }
      return this.q;
    },
    // 方法二：自顶向下递归
    method2: function (prices, n) {
      var r = [];
      for (var i = 0; i < n; i++) {
        r[i] = -Infinity;
      }
      var q = -Infinity;
      return fn(prices, n, r);
      function fn(prices, n, r) {
        if (r[n] >= 0) {
          return r[n];
        }
        if (n == 0) {
          q = 0;
        } else {
          q = -Infinity;
          for (var j = 1; j <= n; j++) {
            q = Math.max(q, fn(prices, n - j, r));
          }
        }
        r[n] = q;
        return q;
      }
    },
    // 方法三：自底向上递归
    method3: function (prices, n) {
      var r = [0];
      for (var i = 1; i <= n; i++) {
        var q = -Infinity;
        for (var j = 1; j <= i; j++) {
          q = Math.max(q, prices[j] + r[i - j])
        }
        r[i] = q;
      }
      return r[n];
    },
    // 方法四：方法三的扩展，不仅返回最大收益r[i]，也返回最优解对应的第一段钢条的切割长度s[i]
    method4: function (prices, n) {
      var r = [0], s = [0], temp = 0;
      for (var i = 1; i <= n; i++) {
        var q = -Infinity;
        for (var j = 1; j <= i; j++) {
          if (q < (temp = prices[j] + r[i - j])) {
            q = temp;
            s[i] = j;
          }
        }
        r[i] = q;
      }
      return [r, s];
    }

  }

  /**
   * @description 最长公共子序列问题：
   * 给出两个序列X=[x1, x2, ..., xm]和Y[y1, y2, ..., yn]
   * 求最长公共子序列C = [ci, ..., cj]
   */
  var LCS = {
    /**
     * 求公共子序列长度
     * @param {array} X 序列X
     * @param {array} Y 序列Y
     * @return {array} [0]：表中数值为对应最长子序列长度，[1]：子问题最优解指向
     */
    LCSLength: function (X, Y) {
      var m = X.length,
        n = Y.length;
      var c = [[]], b = [[]];
      // 初始化[m+1][n+1]的二维数组，且第一行第一列值为0
      for (var i = 0; i <= m; i++) {
        c[i] = [0];
        b[i] = [0];
      }
      for (var j = 1; j <= n; j++) {
        c[0][j] = 0;
        b[0][j] = 0;
      }
      // 递推求后续每一项值
      for (var i = 1; i <= m; i++) {
        for (var j = 1; j <= n; j++) {
          if (X[i] == Y[j]) {
            c[i][j] = c[i - 1][j - 1] + 1;
            b[i][j] = '↖'; // 子问题最优解指向
          } else if (c[i - 1][j] >= c[i][j - 1]) {
            c[i][j] = c[i - 1][j];
            b[i][j] = '←'; // 子问题最优解指向
          } else {
            c[i][j] = c[i][j - 1];
            b[i][j] = '↑'; // 子问题最优解指向
          }
        }
      }
      return [c, b];
    },
    getLCS: function (b, X, i, j) {
      var ret = [];
      if (i == 0 || j == 0) {
        return;
      }
      if (b[i][j] == '↖') {
        this.getLCS(b, X, i - 1, j - 1);
        console.log(X[i]);
        ret.push(X[i]);
      } else if (b[i][j] == '↑') {
        this.getLCS(b, X, i, j - 1);
      } else {
        this.getLCS(b, X, i - 1, j);
      }
      return ret;
    }
  }
  /**
   * @desc 活动安排问题，递归贪心算法
   * @param {array} s 活动开始时间数组
   * @param {array} f 活动结束时间数组
   * @param {number} k 开始遍历下标
   * @param {number} n 结束遍历下标
   */
  var recursionActivitySelector = function (s, f, k, n) {
    var m = k + 1;
    var a = [];
    while (m <= n && s[m] < f[k]) {
      m++;
    }
    if (m <= n) {
      return a.push(recursionActivitySelector(s, f, m, n));
    } else {
      return a;
    }
  }

  var greedyActivitySelector = function (s, f) {
    var n = s.length;
    var a = [0];
    var k = 1;
    for (var m = 2; m < n; m++) {
      if (s[m] >= f[k]) {
        a.push(m);
        k = m;
      }
    }
    return a;
  }

  var factorial = function (n) {
    var ret = 1
    for (var i = 1; i <= n; i++) {
      ret *= i;
    }
    return ret.toString();
  }

  var selection = function (array, k) {
    var arr = array.slice();
    var len = arr.length;
    for (var i = 0; i < len - 1; i++) {
      var maxIdx = i;
      //未排序序列中找出最大值
      for (var j = i + 1; j < len; j++) {
        if (arr[j] > arr[maxIdx]) {
          maxIdx = j;
        }
      }
      //最大值不等于当前值，则交换
      if (maxIdx != i) {
        arr[i] = [arr[maxIdx], arr[maxIdx] = arr[i]][0];
      }
      if (i == k - 1) {
        break;
      }
    }
    return arr[k - 1];
  };

  return {
    findMaxSumSubArr1,
    findMaxSumSubArr2,
    cutSteel,
    LCS,
    recursionActivitySelector,
    greedyActivitySelector,
    factorial,
    selection
  }
})




