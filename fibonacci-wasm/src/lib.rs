use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn fibonacci(n: u32) -> u32 {
    match n {
        0 => 0,
        1 => 1,
        _ => fibonacci(n - 1) + fibonacci(n - 2),
    }
}

#[wasm_bindgen]
pub fn calculate_age(birth_year: u16) -> Result<String, JsValue> {
    let current_year = 2025;
    if birth_year > current_year {
        return Err(JsValue::from_str("Birth year cant be in the future"));
    }

    let age = current_year - birth_year;
    Ok(format!("You are {} years old", age))
}