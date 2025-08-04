export default {
  validatePalletCode(storageType, palletCode) {
    if (storageType === 'B库') {
      if (palletCode.charAt(0) !== 'B') {
        return {
          message: '该载具不属于此库',
          field: 'pallet_code',
          status: false
        }
      }
      if (palletCode.length !== 8) {
        return {
          message: '该载具编号长度不正确',
          field: 'pallet_code',
          status: false
        }
      }
    } else if (storageType === 'H库') {
      if (palletCode.charAt(0) !== 'P' & palletCode.charAt(0) !== 'B' & palletCode.charAt(0) !== 'Z') {
        return {
          message: '该载具首字母不符合规定',
          field: 'pallet_code',
          status: false
        }
      }
    } else if (storageType === 'X库') {
      if (palletCode.charAt(0) !== 'P' || palletCode.charAt(1) !== '7') {
        return {
          message: '该载具不属于此库',
          field: 'pallet_code',
          status: false
        }
      }
      if (palletCode.length !== 7) {
        return {
          message: '该载具编号长度不正确',
          field: 'pallet_code',
          status: false
        }
      }
    } else if (storageType === 'D库') {
      if (palletCode.charAt(0) !== 'P' || palletCode.charAt(1) !== '6') {
        return {
          message: '该载具不属于此库',
          field: 'pallet_code',
          status: false
        }
      }
      if (palletCode.length !== 7) {
        return {
          message: '该载具编号长度不正确',
          field: 'pallet_code',
          status: false
        }
      }
    } else if (storageType === 'P库') {
      if (palletCode === '木箱' || palletCode === '空托盘垛') {
        return {
          status: true
        }
      }
      if (palletCode.charAt(0) !== 'P' || palletCode.charAt(1) !== '5') {
        return {
          message: '该载具不属于此库',
          field: 'pallet_code',
          status: false
        }
      }
      if (palletCode.length !== 7) {
        return {
          message: '该载具编号长度不正确',
          field: 'pallet_code',
          status: false
        }
      }
    }
    return {
      status: true
    }
  }
}
