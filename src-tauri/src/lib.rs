use serde::Serialize;
use std::fs;
use tauri::Manager;

#[derive(Serialize)]
pub struct Skill {
    pub name: String,
    pub description: Option<String>,
    pub path: String,
}

#[tauri::command]
fn get_global_skills(app_handle: tauri::AppHandle) -> Result<Vec<Skill>, String> {
    let mut skills = Vec::new();
    
    // Get the home directory using Tauri's path resolver
    let home_dir = match app_handle.path().home_dir() {
        Ok(dir) => dir,
        Err(e) => return Err(format!("Could not find home directory: {}", e)),
    };
    
    let skills_dir = home_dir.join(".agent-skills");

    if skills_dir.exists() && skills_dir.is_dir() {
        let entries = match fs::read_dir(&skills_dir) {
            Ok(entries) => entries,
            Err(e) => return Err(format!("Failed to read skills directory: {}", e)),
        };

        for entry in entries {
            if let Ok(entry) = entry {
                let path = entry.path();
                let name = entry.file_name().to_string_lossy().into_owned();
                
                // Ignore hidden files/folders
                if !name.starts_with('.') {
                    skills.push(Skill {
                        name,
                        description: None,
                        path: path.to_string_lossy().into_owned(),
                    });
                }
            }
        }
    }
    
    Ok(skills)
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn run_command(command: String) -> Result<String, String> {
    use std::process::Command;
    
    let output = if cfg!(target_os = "windows") {
        Command::new("cmd")
            .args(["/C", &command])
            .output()
    } else {
        Command::new("sh")
            .args(["-c", &command])
            .output()
    };

    match output {
        Ok(output) => {
            if output.status.success() {
                Ok(String::from_utf8_lossy(&output.stdout).to_string())
            } else {
                Err(String::from_utf8_lossy(&output.stderr).to_string())
            }
        }
        Err(e) => Err(format!("Failed to execute command: {}", e)),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, get_global_skills, run_command])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
