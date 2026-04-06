use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use tauri::Manager;

#[derive(Serialize, Deserialize, Clone)]
pub struct Skill {
    pub name: String,
    pub description: Option<String>,
    pub path: String,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct SkillDetail {
    pub name: String,
    pub description: Option<String>,
    pub content: String,
    pub created_at: String,
    pub path: String,
}

#[derive(Serialize, Deserialize)]
pub struct SkillMetadata {
    pub name: String,
    pub description: Option<String>,
    pub created_at: String,
}

#[derive(Serialize)]
pub struct ProjectSkill {
    pub name: String,
    pub source_path: String,
    pub is_global: bool,
}

fn get_skills_dir(app_handle: &tauri::AppHandle) -> Result<PathBuf, String> {
    let home_dir = match app_handle.path().home_dir() {
        Ok(dir) => dir,
        Err(e) => return Err(format!("Could not find home directory: {}", e)),
    };
    Ok(home_dir.join(".agents/skills"))
}

fn get_skill_dir(app_handle: &tauri::AppHandle, name: &str) -> Result<PathBuf, String> {
    let skills_dir = get_skills_dir(app_handle)?;
    Ok(skills_dir.join(name))
}

fn read_metadata(skill_dir: &PathBuf) -> Result<SkillMetadata, String> {
    let metadata_path = skill_dir.join("metadata.json");
    let metadata_str = fs::read_to_string(&metadata_path)
        .map_err(|e| format!("Failed to read metadata.json: {}", e))?;
    serde_json::from_str(&metadata_str)
        .map_err(|e| format!("Failed to parse metadata.json: {}", e))
}

fn write_metadata(skill_dir: &PathBuf, metadata: &SkillMetadata) -> Result<(), String> {
    let metadata_path = skill_dir.join("metadata.json");
    let metadata_str = serde_json::to_string_pretty(metadata)
        .map_err(|e| format!("Failed to serialize metadata: {}", e))?;
    fs::write(&metadata_path, metadata_str)
        .map_err(|e| format!("Failed to write metadata.json: {}", e))
}

#[tauri::command]
fn get_global_skills(app_handle: tauri::AppHandle) -> Result<Vec<Skill>, String> {
    let mut skills = Vec::new();
    let skills_dir = get_skills_dir(&app_handle)?;

    if !skills_dir.exists() || !skills_dir.is_dir() {
        return Ok(skills);
    }

    let entries = fs::read_dir(&skills_dir)
        .map_err(|e| format!("Failed to read skills directory: {}", e))?;

    for entry in entries {
        if let Ok(entry) = entry {
            let path = entry.path();
            let name = entry.file_name().to_string_lossy().into_owned();

            if name.starts_with('.') || !path.is_dir() {
                continue;
            }

            let (description, created_at) = match read_metadata(&path) {
                Ok(meta) => (meta.description, Some(meta.created_at)),
                Err(_) => (None, None),
            };

            let _ = created_at;

            skills.push(Skill {
                name,
                description,
                path: path.to_string_lossy().into_owned(),
            });
        }
    }

    Ok(skills)
}

#[tauri::command]
fn create_skill(
    app_handle: tauri::AppHandle,
    name: String,
    description: Option<String>,
    content: String,
) -> Result<Skill, String> {
    let skills_dir = get_skills_dir(&app_handle)?;
    let skill_dir = skills_dir.join(&name);

    if skill_dir.exists() {
        return Err(format!("Skill '{}' already exists", name));
    }

    fs::create_dir_all(&skill_dir)
        .map_err(|e| format!("Failed to create skill directory: {}", e))?;

    fs::write(skill_dir.join("SKILL.md"), &content)
        .map_err(|e| format!("Failed to write SKILL.md: {}", e))?;

    let metadata = SkillMetadata {
        name: name.clone(),
        description: description.clone(),
        created_at: chrono_now(),
    };
    write_metadata(&skill_dir, &metadata)?;

    Ok(Skill {
        name,
        description,
        path: skill_dir.to_string_lossy().into_owned(),
    })
}

#[tauri::command]
fn delete_skill(app_handle: tauri::AppHandle, name: String) -> Result<(), String> {
    let skill_dir = get_skill_dir(&app_handle, &name)?;

    if !skill_dir.exists() {
        return Err(format!("Skill '{}' not found", name));
    }

    fs::remove_dir_all(&skill_dir)
        .map_err(|e| format!("Failed to delete skill '{}': {}", name, e))
}

#[tauri::command]
fn get_skill_detail(app_handle: tauri::AppHandle, name: String) -> Result<SkillDetail, String> {
    let skill_dir = get_skill_dir(&app_handle, &name)?;

    if !skill_dir.exists() {
        return Err(format!("Skill '{}' not found", name));
    }

    let metadata = read_metadata(&skill_dir)?;

    let content = fs::read_to_string(skill_dir.join("SKILL.md"))
        .map_err(|e| format!("Failed to read SKILL.md: {}", e))?;

    Ok(SkillDetail {
        name: metadata.name,
        description: metadata.description,
        content,
        created_at: metadata.created_at,
        path: skill_dir.to_string_lossy().into_owned(),
    })
}

#[tauri::command]
fn update_skill(
    app_handle: tauri::AppHandle,
    name: String,
    content: String,
    description: Option<String>,
) -> Result<SkillDetail, String> {
    let skill_dir = get_skill_dir(&app_handle, &name)?;

    if !skill_dir.exists() {
        return Err(format!("Skill '{}' not found", name));
    }

    fs::write(skill_dir.join("SKILL.md"), &content)
        .map_err(|e| format!("Failed to write SKILL.md: {}", e))?;

    let mut metadata = read_metadata(&skill_dir)?;
    if let Some(desc) = description {
        metadata.description = Some(desc);
    }
    write_metadata(&skill_dir, &metadata)?;

    Ok(SkillDetail {
        name: metadata.name,
        description: metadata.description,
        content,
        created_at: metadata.created_at,
        path: skill_dir.to_string_lossy().into_owned(),
    })
}

#[tauri::command]
fn get_project_skills(project_path: String) -> Result<Vec<ProjectSkill>, String> {
    let mut skills = Vec::new();
    let project_skills_dir = PathBuf::from(&project_path).join(".agents/skills");

    if !project_skills_dir.exists() || !project_skills_dir.is_dir() {
        return Ok(skills);
    }

    let entries = fs::read_dir(&project_skills_dir)
        .map_err(|e| format!("Failed to read project skills directory: {}", e))?;

    for entry in entries {
        if let Ok(entry) = entry {
            let path = entry.path();
            let name = entry.file_name().to_string_lossy().into_owned();

            if name.starts_with('.') {
                continue;
            }

            let (source_path, is_global) = if path.is_symlink() {
                let target = fs::read_link(&path)
                    .map(|p| p.to_string_lossy().into_owned())
                    .unwrap_or_else(|_| path.to_string_lossy().into_owned());
                (target, true)
            } else {
                (path.to_string_lossy().into_owned(), false)
            };

            skills.push(ProjectSkill {
                name,
                source_path,
                is_global,
            });
        }
    }

    Ok(skills)
}

#[tauri::command]
fn link_skill_to_project(
    app_handle: tauri::AppHandle,
    skill_name: String,
    project_path: String,
) -> Result<(), String> {
    let skill_dir = get_skill_dir(&app_handle, &skill_name)?;

    if !skill_dir.exists() {
        return Err(format!("Skill '{}' not found", skill_name));
    }

    let project_skills_dir = PathBuf::from(&project_path).join(".agents/skills");
    fs::create_dir_all(&project_skills_dir)
        .map_err(|e| format!("Failed to create project .agents/skills directory: {}", e))?;

    let link_path = project_skills_dir.join(&skill_name);
    if link_path.exists() || link_path.is_symlink() {
        return Err(format!(
            "Skill '{}' is already linked in this project",
            skill_name
        ));
    }

    #[cfg(unix)]
    {
        std::os::unix::fs::symlink(&skill_dir, &link_path)
            .map_err(|e| format!("Failed to create symlink: {}", e))?;
    }

    #[cfg(windows)]
    {
        std::os::windows::fs::symlink_dir(&skill_dir, &link_path)
            .map_err(|e| format!("Failed to create symlink: {}", e))?;
    }

    Ok(())
}

#[tauri::command]
fn unlink_skill_from_project(
    skill_name: String,
    project_path: String,
) -> Result<(), String> {
    let link_path = PathBuf::from(&project_path)
        .join(".agents/skills")
        .join(&skill_name);

    if !link_path.exists() && !link_path.is_symlink() {
        return Err(format!(
            "Skill '{}' is not linked in this project",
            skill_name
        ));
    }

    if link_path.is_symlink() {
        fs::remove_file(&link_path)
            .map_err(|e| format!("Failed to remove symlink: {}", e))
    } else {
        fs::remove_dir_all(&link_path)
            .map_err(|e| format!("Failed to remove skill directory: {}", e))
    }
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

fn chrono_now() -> String {
    let now = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap_or_default();
    format!("{}", now.as_secs())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            run_command,
            get_global_skills,
            create_skill,
            delete_skill,
            get_skill_detail,
            update_skill,
            get_project_skills,
            link_skill_to_project,
            unlink_skill_from_project,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
