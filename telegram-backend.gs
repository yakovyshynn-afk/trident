/**
 * Триdent — backend для форми заявок → Telegram.
 * Розгортається БЕЗКОШТОВНО на Google Apps Script. Токен бота живе тут, на сервері,
 * і НІКОЛИ не потрапляє в код сайту.
 *
 * ── ЯК ПІДКЛЮЧИТИ (5 хвилин) ─────────────────────────────────────────────
 * 1. Створіть бота: у Telegram напишіть @BotFather → /newbot → отримайте ТОКЕН.
 * 2. Дізнайтеся свій CHAT_ID: напишіть боту будь-що, потім відкрийте
 *    https://api.telegram.org/bot<ТОКЕН>/getUpdates і знайдіть "chat":{"id":...}.
 *    (Або додайте бота в групу адміністраторів і візьміть id групи — від'ємне число.)
 * 3. Відкрийте https://script.google.com → New project → вставте цей код.
 * 4. Впишіть свої TOKEN і CHAT_ID нижче.
 * 5. Deploy → New deployment → тип "Web app":
 *       Execute as: Me,  Who has access: Anyone.
 *    Скопіюйте URL вигляду https://script.google.com/macros/s/XXXX/exec
 * 6. Вставте цей URL у index.html → TRIDENT_CONFIG.formEndpoint.
 * Готово: заявки з форми миттєво падатимуть у Telegram.
 * ─────────────────────────────────────────────────────────────────────────
 */

var TOKEN   = 'ВСТАВТЕ_ТОКЕН_БОТА';      // напр. 8123456789:AAH...
var CHAT_ID = 'ВСТАВТЕ_CHAT_ID';         // напр. 123456789 (або -100... для групи)

function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    // елементарний антиспам: honeypot із фронтенду (не має приходити заповненим)
    if (d.website) { return _ok(); }

    var text =
      '🦷 <b>Нова заявка з сайту Триdent</b>\n\n' +
      '👤 Ім’я: ' + _clean(d.name) + '\n' +
      '📞 Телефон: ' + _clean(d.phone) + '\n' +
      '🩺 Послуга: ' + _clean(d.service) + '\n' +
      (d.msg ? ('💬 Коментар: ' + _clean(d.msg) + '\n') : '') +
      '🕒 ' + _clean(d.time);

    UrlFetchApp.fetch('https://api.telegram.org/bot' + TOKEN + '/sendMessage', {
      method: 'post',
      payload: { chat_id: CHAT_ID, text: text, parse_mode: 'HTML' },
      muteHttpExceptions: true
    });
    return _ok();
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() { return ContentService.createTextOutput('Trident form backend is running.'); }
function _ok()   { return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON); }
function _clean(s){ return String(s || '—').replace(/[<>]/g, ''); }
