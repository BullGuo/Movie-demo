export function asyncLoadScript({ id, src, type = "async" }) {
  return new Promise((resolve, reject) => {
    if (id && document.getElementById(id)) return resolve();
    let script = document.createElement("script");
    if (["async", "defer"].indexOf(type) !== -1) script[type] = type;
    script.id = id;
    script.src = src;
    script.onload = () => setTimeout(() => resolve({ ok: true }), 50);
    script.onerror = () => reject({ ok: false });
    document.getElementsByTagName("head")[0].appendChild(script);
  }).catch(err => {
    console.error(err);
  });
}
