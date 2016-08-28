# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
  config.vm.box = "centos/7"

  # ホストPCとゲストPCのネットワークを構築
  config.vm.network "private_network", ip: "172.16.10.12"

  # ホストPCのこのフォルダをマウント ※2016年7月現在のcentos/7だと明示的に指定しないとエラーになる？
  config.vm.synced_folder ".", "/home/vagrant/sync", type: "virtualbox"

  # メモリサイズ
  config.vm.provider "virtualbox" do |vb|
      vb.memory = "1024"
  end

  # ゲストPCにansibleをインストールし共有フォルダのプレイブックを実行
  config.vm.provision "ansible_local" do |ansible|
    ansible.playbook = "playbook.yml"
    ansible.provisioning_path = "/home/vagrant/sync/"
  end
end
