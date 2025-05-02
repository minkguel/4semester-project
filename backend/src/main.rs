use axum::{routing::get, Router};
use std::net::SocketAddr;

fn fibonacci(n: u32) -> u32 {
    match n {
        0 => 0,
        1 => 1,
        _ => fibonacci(n - 1) + fibonacci(n - 2),
    }
}

async fn handle_fibonacci(axum::extract::Path(n): axum::extract::Path<u32>) -> String {
    let result = fibonacci(n);
    format!("Fibonacci ({n}) = {result}")
}

#[tokio::main]
async fn main() {
    let app = Router::new().without_v07_checks().route("/fibonacci/:n", get(handle_fibonacci));
    
    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    println!("Listening on {}", addr);
    axum_server::bind(addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}