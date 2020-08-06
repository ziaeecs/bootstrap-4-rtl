import $ from 'jquery'

let isDocumentInRtlDirection = false

const documentDirection = $('html').attr('dir')

if (documentDirection && documentDirection.trim().toLowerCase() === 'rtl') {
  isDocumentInRtlDirection = true
}

export default {
  isDocumentInRtlDirection
}
